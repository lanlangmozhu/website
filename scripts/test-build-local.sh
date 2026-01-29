#!/bin/bash

# 本地测试 CI/CD 构建流程
# 模拟 GitHub Actions 的构建和验证步骤

set -e

echo "🚀 开始本地构建测试..."
echo ""

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境
echo "📋 环境检查:"
echo "  NODE_ENV: ${NODE_ENV:-未设置}"
echo "  PWD: $(pwd)"
echo ""

# 检查必要文件
echo "📁 项目结构检查:"
if [ ! -d "public" ]; then
  echo -e "${RED}❌ public 目录不存在${NC}"
  exit 1
fi
echo -e "${GREEN}✅ public 目录存在${NC}"

if [ ! -f "public/posts-list.json" ]; then
  echo -e "${YELLOW}⚠️  public/posts-list.json 不存在${NC}"
else
  echo -e "${GREEN}✅ public/posts-list.json 存在${NC}"
fi

if [ ! -d "public/docs" ]; then
  echo -e "${YELLOW}⚠️  public/docs 目录不存在${NC}"
else
  MD_COUNT=$(find public/docs -name '*.md' | wc -l)
  echo -e "${GREEN}✅ public/docs 目录存在 ($MD_COUNT 个 markdown 文件)${NC}"
fi
echo ""

# 清理旧的构建
if [ -d "out" ]; then
  echo "🧹 清理旧的构建输出..."
  rm -rf out
fi

# 运行构建
echo "🔨 开始构建..."
export NODE_ENV=production
pnpm build

# 验证构建输出
echo ""
echo "📊 构建验证:"
if [ ! -d "out" ]; then
  echo -e "${RED}❌ Build failed - out directory not found${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Build successful - Static files generated in out/${NC}"
echo "📊 Build statistics:"
echo "  Total files: $(find out -type f | wc -l)"
echo "  Total directories: $(find out -type d | wc -l)"
echo ""

# 检查必需的目录
echo "📁 Required directories check:"
REQUIRED_DIRS=("about" "ai" "auth" "blog" "docs" "images" "login" "post" "practice" "404" "_next")
MISSING_DIRS=()
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "out/$dir" ]; then
    FILE_COUNT=$(find "out/$dir" -type f | wc -l)
    echo -e "  ${GREEN}✅ out/$dir ($FILE_COUNT files)${NC}"
  else
    echo -e "  ${RED}❌ out/$dir (missing)${NC}"
    MISSING_DIRS+=("$dir")
  fi
done

if [ ${#MISSING_DIRS[@]} -gt 0 ]; then
  echo ""
  echo -e "${RED}❌ Missing directories: ${MISSING_DIRS[*]}${NC}"
  echo "📋 All directories in out/:"
  ls -la out/
  exit 1
fi

# 检查关键文件
echo ""
echo "📄 Key files check:"
KEY_FILES=("index.html" "posts-list.json" "rss.xml")
for file in "${KEY_FILES[@]}"; do
  if [ -f "out/$file" ]; then
    echo -e "  ${GREEN}✅ out/$file${NC}"
  else
    echo -e "  ${RED}❌ out/$file (missing)${NC}"
    exit 1
  fi
done

# 检查关键页面
echo ""
echo "📄 Key pages check:"
KEY_PAGES=("blog/index.html" "ai/index.html" "practice/index.html" "about/index.html" "login/index.html")
for page in "${KEY_PAGES[@]}"; do
  if [ -f "out/$page" ]; then
    echo -e "  ${GREEN}✅ out/$page${NC}"
  else
    echo -e "  ${RED}❌ out/$page (missing)${NC}"
    exit 1
  fi
done

echo ""
echo -e "${GREEN}✅ All checks passed! Build is ready for deployment.${NC}"
echo ""
echo "📦 构建产物位置: out/"
echo "📊 文件统计:"
echo "  - 总文件数: $(find out -type f | wc -l)"
echo "  - 总目录数: $(find out -type d | wc -l)"
echo ""
echo "💡 提示:"
echo "  - 可以使用 'pnpm start' 启动本地服务器测试"
echo "  - 或使用 'python3 -m http.server 3000' 在 out/ 目录测试静态文件"
