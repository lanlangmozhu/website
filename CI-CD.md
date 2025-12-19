# CI/CD 配置文档

本项目已配置完整的 GitHub Actions CI/CD 流程，包括自动化测试和静态网站部署到宝塔面板。

## 📋 技术栈

- **测试框架**: Vitest + React Testing Library
- **CI/CD 平台**: GitHub Actions
- **包管理器**: pnpm 8
- **Node.js**: 20
- **运行环境**: ubuntu-latest
- **部署方式**: 静态网站（Next.js Static Export）
- **服务器**: 宝塔 Linux 面板

## 🔄 CI/CD 工作流

### 工作流流程

```
1. Lint Job
   └─> 代码质量检查 (ESLint)

2. Test Job
   ├─> 运行单元测试
   ├─> 生成覆盖率报告
   └─> 上传覆盖率到 Codecov (可选)

3. Build Job
   ├─> 安装依赖
   ├─> 构建生产版本
   ├─> 验证构建输出
   └─> 上传构建产物 (artifacts)

4. Deploy Job (仅 main/master 分支)
   ├─> 下载构建产物
   ├─> 验证静态文件完整性
   ├─> 部署静态文件到宝塔面板网站目录 (SSH)
   ├─> 设置文件权限
   └─> 部署完成（宝塔面板自动处理 Nginx 配置）
```

### 触发条件

- **Push 到 main/master**: 运行所有步骤，包括部署
- **Pull Request**: 只运行 lint、test 和 build，不部署

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 本地测试

```bash
# 开发模式（监听文件变化）
pnpm test

# 运行一次测试
pnpm test:run

# 生成覆盖率报告
pnpm test:coverage

# 代码检查
pnpm lint

# 构建项目
pnpm build
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库中设置以下密钥：

**Settings > Secrets and variables > Actions > New repository secret**

| 密钥名称 | 说明 | 示例 |
|---------|------|------|
| `SSH_HOST` | 服务器 IP 或域名 | `192.168.1.100` 或 `example.com` |
| `SSH_USERNAME` | SSH 用户名（宝塔面板用户） | `root` 或宝塔面板用户名 |
| `SSH_PRIVATE_KEY` | SSH 私钥（完整内容） | `-----BEGIN RSA PRIVATE KEY-----...` |
| `SSH_PORT` | SSH 端口（可选，默认 22） | `22` |
| `DEPLOY_PATH` | 宝塔网站目录路径 | `/www/wwwroot/your-domain.com` |
| `DEPLOY_URL` | 网站 URL（可选） | `https://your-site.com` |

**重要提示**：
- `DEPLOY_PATH` 应该是宝塔面板中网站的根目录，通常在 `/www/wwwroot/域名/`
- 可以在宝塔面板的「网站」→「设置」→「网站目录」中查看

### 4. 宝塔面板配置

#### 4.1 在宝塔面板中创建网站

1. 登录宝塔面板
2. 点击「网站」→「添加站点」
3. 填写域名（如 `your-domain.com`）
4. 选择「纯静态」或「PHP 项目」（静态网站选择纯静态即可）
5. 记录网站根目录路径（通常是 `/www/wwwroot/your-domain.com`）

#### 4.2 配置 SSH 密钥

**方法一：直接在服务器上配置（推荐，适用于所有宝塔版本）**

1. **在本地生成 SSH 密钥对**（如果还没有）：
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions
   ```
   按提示操作，可以设置密码或直接回车（不设置密码）

2. **将公钥添加到服务器**：

   **方式 A：使用 ssh-copy-id（最简单）**
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions.pub root@你的服务器IP
   ```
   输入服务器密码后，公钥会自动添加到服务器的 `~/.ssh/authorized_keys`

   **方式 B：手动添加（如果方式 A 不行）**
   ```bash
   # 1. 查看公钥内容
   cat ~/.ssh/github_actions.pub
   
   # 2. SSH 登录服务器（使用密码）
   ssh root@你的服务器IP
   
   # 3. 在服务器上执行以下命令
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   echo "你的公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   exit
   ```

3. **测试 SSH 密钥连接**：
   ```bash
   ssh -i ~/.ssh/github_actions root@你的服务器IP
   ```
   如果可以直接登录（不需要密码），说明配置成功！

4. **将私钥添加到 GitHub Secrets**：
   ```bash
   cat ~/.ssh/github_actions
   ```
   - 复制完整私钥内容（包括 `-----BEGIN RSA PRIVATE KEY-----` 和 `-----END RSA PRIVATE KEY-----`）
   - 在 GitHub 仓库：Settings → Secrets and variables → Actions → New repository secret
   - 名称：`SSH_PRIVATE_KEY`
   - 值：粘贴私钥内容
   - 保存

**方法二：通过宝塔面板配置（如果面板支持）**

1. 在本地生成密钥对（同上）
2. 查看公钥：`cat ~/.ssh/github_actions.pub`
3. 在宝塔面板中查找：
   - 「安全」→「SSH 密钥管理」或「SSH 设置」
   - 「系统」→「SSH 配置」
   - 如果找不到，使用方法一

**方法三：使用密码认证（不推荐，安全性较低）**

如果无法配置 SSH 密钥，可以修改 GitHub Actions 工作流使用密码认证，但安全性较低。

#### 4.3 配置网站目录权限

确保网站目录有正确的权限：

```bash
# SSH 登录服务器后执行
cd /www/wwwroot/your-domain.com
chown -R www:www .
chmod -R 755 .
```

或者在宝塔面板中：
- 「网站」→「设置」→「网站目录」
- 确保目录权限正确

### 5. 触发 CI/CD

```bash
git add .
git commit -m "feat: 更新功能"
git push origin main
```

## 📁 项目结构

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD 工作流配置
├── components/
│   └── __tests__/            # 组件测试
├── utils/
│   └── __tests__/            # 工具函数测试
├── vitest.config.ts          # Vitest 配置
├── vitest.setup.ts           # 测试环境设置
└── scripts/
    └── deploy.sh             # 手动部署脚本（可选）
```

## 🔧 环境配置

### 必需的环境

| 环境 | 版本 | 说明 |
|-----|------|------|
| **操作系统** | ubuntu-latest | GitHub Actions runner |
| **Node.js** | 20 | Next.js 15 需要 Node.js 18+ |
| **pnpm** | 8 | 包管理器版本 |
| **NODE_ENV** | production | 构建时设置 |
| **输出格式** | Static Export | 静态 HTML/CSS/JS 文件 |

### 工作流配置

- **Lint Job**: 代码质量检查，不需要生产环境
- **Test Job**: 运行测试，生成覆盖率报告
- **Build Job**: 构建静态文件（生成 `out/` 目录），上传 artifacts
- **Deploy Job**: 下载 artifacts，部署静态文件到宝塔网站目录

### 静态网站说明

本项目配置为静态网站导出：
- 构建后生成 `out/` 目录，包含所有静态文件
- 不需要 Node.js 运行时环境
- 可以直接部署到任何静态网站托管服务（Nginx、Apache、CDN 等）
- 宝塔面板会自动通过 Nginx 提供静态文件服务

## 📝 编写测试

### 工具函数测试示例

```typescript
// utils/__tests__/example.test.ts
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../example';

describe('yourFunction', () => {
  it('应该返回正确的结果', () => {
    expect(yourFunction('input')).toBe('expected');
  });
});
```

### React 组件测试示例

```typescript
// components/__tests__/Example.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Example } from '../Example';

describe('Example Component', () => {
  it('应该渲染内容', () => {
    render(<Example />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🐛 故障排查

### 测试失败

```bash
# 清除缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 运行测试查看详细错误
pnpm test:run
```

### 部署失败

1. **检查 SSH 连接**：
   ```bash
   ssh -i ~/.ssh/github_actions user@your-server.com
   ```

2. **检查宝塔网站目录权限**：
   ```bash
   ls -la /www/wwwroot/your-domain.com
   ```
   确保目录存在且有写入权限

3. **检查宝塔面板网站配置**：
   - 登录宝塔面板
   - 进入「网站」→「设置」
   - 确认网站目录路径正确
   - 检查 Nginx 配置是否正常

4. **查看 GitHub Actions 日志**：
   - 进入仓库的 Actions 标签页
   - 点击失败的 workflow
   - 查看详细错误信息

5. **手动测试部署**：
   ```bash
   # 本地构建
   pnpm build
   
   # 手动上传到服务器测试
   scp -r out/* user@server:/www/wwwroot/your-domain.com/
   ```

## ✅ 如何验证部署是否成功

### 1. 检查 GitHub Actions 运行状态

1. **进入 GitHub 仓库**：
   - 访问 `https://github.com/你的用户名/website`
   - 点击顶部的 **Actions** 标签页

2. **查看工作流运行状态**：
   - 找到最新的 workflow run（应该显示你最近的 commit）
   - 检查所有 job 的状态：
     - ✅ **绿色勾号** = 成功
     - ❌ **红色叉号** = 失败
     - 🟡 **黄色圆点** = 进行中

3. **查看部署日志**：
   - 点击 **Deploy to Server** job
   - 展开各个步骤查看详细日志
   - 查找以下成功信息：
     - `✅ Build artifacts verified`
     - `✅ Permissions set successfully`
     - `✅ Deployment verification successful!`
     - `✅ Static website deployed successfully to Baota Panel!`

### 2. 检查服务器上的文件

**通过 SSH 登录服务器检查**：

```bash
# SSH 登录服务器
ssh root@你的服务器IP

# 进入网站目录
cd /www/wwwroot/你的域名

# 检查文件是否存在
ls -la

# 应该看到以下文件/目录：
# - index.html（首页）
# - _next/（Next.js 静态资源）
# - 其他页面文件

# 检查文件修改时间（应该是最近的时间）
ls -lt | head -10

# 检查文件权限
ls -la index.html
# 应该显示：-rw-r--r-- 1 www www ...
```

### 3. 访问网站验证

1. **直接访问网站**：
   - 在浏览器中打开你的网站 URL
   - 检查页面是否正常显示
   - 检查是否有最新的更改

2. **检查浏览器开发者工具**：
   - 按 `F12` 打开开发者工具
   - 查看 **Network** 标签页
   - 确认所有资源（CSS、JS、图片）都正常加载
   - 检查是否有 404 错误

3. **检查页面源代码**：
   - 右键点击页面 → 查看页面源代码
   - 确认 HTML 内容是最新的

### 4. 使用命令行验证（可选）

```bash
# 检查网站是否可以访问
curl -I https://你的域名.com

# 应该返回 HTTP 200 状态码

# 检查首页内容
curl https://你的域名.com | head -20

# 检查特定文件是否存在
curl -I https://你的域名.com/index.html
curl -I https://你的域名.com/_next/static/...
```

### 5. 在宝塔面板中检查

1. **文件管理**：
   - 登录宝塔面板
   - 进入「文件」→ 找到网站目录
   - 检查文件修改时间是否为最新

2. **网站日志**：
   - 进入「网站」→「设置」→「日志」
   - 查看访问日志，确认有新的访问记录

### 6. 部署验证步骤（自动）

CI/CD 工作流已包含自动验证步骤，会检查：
- ✅ `index.html` 文件是否存在
- ✅ 文件数量统计
- ✅ `_next` 目录是否存在
- ✅ 显示部署的文件列表

如果验证失败，GitHub Actions 会显示错误信息。

## 🎯 快速验证清单

部署后，快速检查以下项目：

- [ ] GitHub Actions 显示所有 job 为 ✅ 成功
- [ ] 部署 job 的日志显示 `✅ Deployment verification successful!`
- [ ] 服务器上 `/www/wwwroot/你的域名/index.html` 文件存在
- [ ] 文件修改时间为最近的时间
- [ ] 网站可以正常访问
- [ ] 页面显示最新的内容
- [ ] 浏览器控制台没有错误

### 构建失败

1. **本地测试构建**：
   ```bash
   pnpm build
   ```

2. **检查环境变量**：
   - 确保所有必需的环境变量已设置

## ⚠️ 注意事项

1. **Artifacts 保留时间**: 7 天（可在工作流中调整）
2. **Artifacts 大小限制**: GitHub Actions 免费版限制 10GB
3. **Codecov**: 可选功能，如果不需要在线覆盖率报告可以移除
4. **静态网站**: 本项目是静态网站，不需要 Node.js 运行时，部署后由 Nginx 直接提供静态文件服务
5. **宝塔面板**: 确保网站目录路径正确，通常为 `/www/wwwroot/域名/`
6. **文件权限**: 部署后会自动设置文件权限，确保 Nginx 可以读取文件
7. **API 路由限制**: 静态导出不支持 Next.js API 路由，如有 API 需求需要使用外部服务

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vitest 文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [PM2 文档](https://pm2.keymetrics.io/docs/)

## ✅ 检查清单

- [ ] 已安装测试依赖 (`pnpm install`)
- [ ] 本地测试通过 (`pnpm test:run`)
- [ ] 本地构建成功 (`pnpm build`)，确认生成了 `out/` 目录
- [ ] 已配置 GitHub Secrets（SSH_HOST, SSH_USERNAME, SSH_PRIVATE_KEY, DEPLOY_PATH）
- [ ] 宝塔面板中已创建网站
- [ ] SSH 密钥已添加到宝塔面板或服务器
- [ ] 网站目录路径正确（`/www/wwwroot/域名/`）
- [ ] 网站目录有写入权限
- [ ] 代码已推送到 GitHub

## 🎉 完成

配置完成后，每次推送到 main/master 分支都会自动：

1. ✅ 运行代码检查
2. ✅ 执行自动化测试
3. ✅ 构建静态网站（生成 `out/` 目录）
4. ✅ 部署静态文件到宝塔面板网站目录
5. ✅ 设置文件权限
6. ✅ 宝塔面板 Nginx 自动提供静态文件服务

Pull Request 会运行前三个步骤，但不部署。

## 📦 静态网站构建说明

### 构建输出

运行 `pnpm build` 后，会在项目根目录生成 `out/` 目录，包含：
- `index.html` - 首页
- `_next/static/` - Next.js 静态资源
- 其他页面和资源文件

### 本地预览静态网站

```bash
# 构建静态文件
pnpm build

# 使用 Python 简单 HTTP 服务器预览
cd out
python3 -m http.server 8000

# 或使用 Node.js http-server
npx http-server out -p 8000
```

访问 `http://localhost:8000` 即可预览静态网站。

