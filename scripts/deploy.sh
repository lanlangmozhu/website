#!/bin/bash

# 部署脚本示例
# 可以在服务器上使用此脚本进行手动部署

set -e

echo "🚀 开始部署..."

# 配置变量
DEPLOY_PATH="/var/www/lanlangmozhu.com"
NODE_VERSION="20"
PORT=3000

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js $NODE_VERSION"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm@8
fi

# 进入部署目录
cd $DEPLOY_PATH || exit 1

# 安装依赖
echo "📦 安装依赖..."
pnpm install --prod --frozen-lockfile

# 构建项目（如果需要）
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    echo "🔨 构建项目..."
    NODE_ENV=production pnpm build
fi

# 重启应用
echo "🔄 重启应用..."
if command -v pm2 &> /dev/null; then
    pm2 restart your-site || pm2 start npm --name "your-site" -- start
elif command -v systemctl &> /dev/null; then
    sudo systemctl restart your-site || echo "⚠️  请手动重启应用"
else
    echo "⚠️  未找到进程管理工具，请手动重启应用"
fi

# 健康检查
echo "🏥 健康检查..."
sleep 5
if curl -f http://localhost:$PORT > /dev/null 2>&1; then
    echo "✅ 部署成功！"
else
    echo "❌ 健康检查失败，请检查应用状态"
    exit 1
fi

