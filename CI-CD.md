# CI/CD 配置文档

本项目已配置完整的 GitHub Actions CI/CD 流程，包括自动化测试和服务器部署。

## 📋 技术栈

- **测试框架**: Vitest + React Testing Library
- **CI/CD 平台**: GitHub Actions
- **包管理器**: pnpm 8
- **Node.js**: 20
- **运行环境**: ubuntu-latest

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
   ├─> 验证构建产物完整性
   ├─> 部署到服务器 (SSH)
   ├─> 安装生产依赖
   ├─> 重启应用
   └─> 健康检查
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
| `SSH_USERNAME` | SSH 用户名 | `deploy` 或 `root` |
| `SSH_PRIVATE_KEY` | SSH 私钥（完整内容） | `-----BEGIN RSA PRIVATE KEY-----...` |
| `SSH_PORT` | SSH 端口（可选，默认 22） | `22` |
| `DEPLOY_PATH` | 部署路径 | `/var/www/your-site` |
| `DEPLOY_URL` | 网站 URL（可选） | `https://your-site.com` |

### 4. 服务器准备

#### 安装 Node.js 和 pnpm

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm@8

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
npm install -g pnpm@8
```

#### 配置 SSH 密钥

```bash
# 在本地生成密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server.com

# 将私钥内容复制到 GitHub Secrets
cat ~/.ssh/github_actions
```

#### 创建部署目录

```bash
sudo mkdir -p /var/www/your-site
sudo chown -R $USER:$USER /var/www/your-site
```

#### 安装 PM2（推荐）

```bash
npm install -g pm2

# 使用项目中的 ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 设置开机自启
```

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
├── ecosystem.config.js       # PM2 配置
└── scripts/
    └── deploy.sh             # 手动部署脚本
```

## 🔧 环境配置

### 必需的环境

| 环境 | 版本 | 说明 |
|-----|------|------|
| **操作系统** | ubuntu-latest | GitHub Actions runner |
| **Node.js** | 20 | Next.js 15 需要 Node.js 18+ |
| **pnpm** | 8 | 包管理器版本 |
| **NODE_ENV** | production | 构建时设置 |

### 工作流配置

- **Lint Job**: 代码质量检查，不需要生产环境
- **Test Job**: 运行测试，生成覆盖率报告
- **Build Job**: 构建生产版本，上传 artifacts
- **Deploy Job**: 下载 artifacts，部署到服务器

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

2. **检查服务器权限**：
   ```bash
   ls -la /var/www/your-site
   ```

3. **查看 GitHub Actions 日志**：
   - 进入仓库的 Actions 标签页
   - 点击失败的 workflow
   - 查看详细错误信息

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
4. **PM2**: 推荐使用 PM2 管理应用进程，支持自动重启和日志管理

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vitest 文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [PM2 文档](https://pm2.keymetrics.io/docs/)

## ✅ 检查清单

- [ ] 已安装测试依赖 (`pnpm install`)
- [ ] 本地测试通过 (`pnpm test:run`)
- [ ] 本地构建成功 (`pnpm build`)
- [ ] 已配置 GitHub Secrets
- [ ] 服务器已安装 Node.js 20 和 pnpm 8
- [ ] SSH 密钥已配置
- [ ] 部署目录已创建且有权限
- [ ] PM2 已安装（可选）
- [ ] 代码已推送到 GitHub

## 🎉 完成

配置完成后，每次推送到 main/master 分支都会自动：

1. ✅ 运行代码检查
2. ✅ 执行自动化测试
3. ✅ 构建项目
4. ✅ 部署到服务器

Pull Request 会运行前三个步骤，但不部署。

