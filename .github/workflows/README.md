# CI/CD 配置说明

## GitHub Actions 工作流

本项目使用 GitHub Actions 进行持续集成和持续部署。

## 工作流说明

### 1. Lint（代码检查）
- 运行 ESLint 检查代码质量
- 在每次 push 和 pull request 时触发

### 2. Test（自动化测试）
- 运行 Vitest 测试套件
- 生成代码覆盖率报告
- 上传覆盖率到 Codecov（可选）

### 3. Build（构建项目）
- 构建 Next.js 生产版本
- 验证构建输出
- 上传构建产物作为 artifacts

### 4. Deploy（部署到服务器）
- 仅在 main/master 分支 push 时触发
- 通过 SSH 部署到自建服务器
- 自动重启应用
- 健康检查

## 配置 GitHub Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下密钥：

### 必需密钥

- `SSH_HOST`: 服务器 IP 地址或域名
- `SSH_USERNAME`: SSH 用户名
- `SSH_PRIVATE_KEY`: SSH 私钥（完整内容，包括 -----BEGIN 和 -----END）
- `DEPLOY_PATH`: 部署路径（例如：`/var/www/your-site`）

### 可选密钥

- `SSH_PORT`: SSH 端口（默认：22）
- `DEPLOY_URL`: 部署后的网站 URL（用于显示在 GitHub Actions 中）

## 服务器准备

### 1. 安装 Node.js 和 pnpm

```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm@8
```

### 2. 配置 SSH 密钥

```bash
# 在服务器上创建部署用户（可选）
sudo adduser deploy

# 在本地生成 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions"

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@your-server.com

# 将私钥内容复制到 GitHub Secrets 的 SSH_PRIVATE_KEY
cat ~/.ssh/id_rsa
```

### 3. 配置 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 创建 PM2 配置文件 ecosystem.config.js
```

### 4. 配置 Nginx（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 本地测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试（监听模式）
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行测试（单次）
pnpm test:run
```

### 运行 Lint

```bash
pnpm lint
```

### 本地构建

```bash
pnpm build
```

## 故障排查

### 部署失败

1. 检查 SSH 连接是否正常
2. 验证服务器上的部署路径是否存在且有写权限
3. 检查服务器上的 Node.js 和 pnpm 版本
4. 查看 GitHub Actions 日志获取详细错误信息

### 测试失败

1. 确保所有依赖已安装：`pnpm install`
2. 检查测试文件语法是否正确
3. 运行 `pnpm test:run` 查看详细错误

### 构建失败

1. 检查 `next.config.js` 配置是否正确
2. 验证环境变量是否设置
3. 查看构建日志中的具体错误信息

## 工作流触发条件

- **Push 到 main/master**: 运行所有步骤，包括部署
- **Pull Request**: 只运行 lint、test 和 build，不部署
- **手动触发**: 可以在 GitHub Actions 页面手动触发工作流

