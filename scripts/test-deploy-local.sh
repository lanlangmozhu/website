#!/bin/bash

# 本地测试完整的 CI/CD 部署流程（模拟）
# 包括构建、打包、验证，但不实际上传到服务器

set -e

echo "🚀 开始本地部署流程测试..."
echo ""

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 步骤 1: 环境检查
echo -e "${BLUE}=== 步骤 1: 环境检查 ===${NC}"
echo "📋 Environment check:"
echo "  NODE_ENV: ${NODE_ENV:-未设置}"
echo "  PWD: $(pwd)"
echo ""

# 步骤 2: 验证项目结构
echo -e "${BLUE}=== 步骤 2: 验证项目结构 ===${NC}"
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
  MD_COUNT=$(find public/docs -name '*.md' 2>/dev/null | wc -l)
  echo -e "${GREEN}✅ public/docs 目录存在 ($MD_COUNT 个 markdown 文件)${NC}"
fi
echo ""

# 步骤 3: 清理旧构建
echo -e "${BLUE}=== 步骤 3: 清理旧构建 ===${NC}"
if [ -d "out" ]; then
  echo "🧹 清理旧的构建输出..."
  rm -rf out
  echo -e "${GREEN}✅ 清理完成${NC}"
fi
echo ""

# 步骤 4: 构建项目
echo -e "${BLUE}=== 步骤 4: 构建项目 ===${NC}"
export NODE_ENV=production
echo "🔨 Building with NODE_ENV=$NODE_ENV"
echo "📦 Running: pnpm build"
pnpm build || {
  echo -e "${RED}❌ Build failed!${NC}"
  if [ -d "out" ]; then
    echo "📋 Checking partial build output..."
    find out -type f | head -20
  fi
  exit 1
}
echo -e "${GREEN}✅ 构建完成${NC}"
echo ""

# 步骤 5: 验证构建输出
echo -e "${BLUE}=== 步骤 5: 验证构建输出 ===${NC}"
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
    FILE_COUNT=$(find "out/$dir" -type f 2>/dev/null | wc -l)
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

if [ ! -f "out/index.html" ]; then
  echo -e "${RED}❌ Missing out/index.html${NC}"
  exit 1
fi
echo -e "${GREEN}✅ All required directories and files present${NC}"
echo ""

# 步骤 6: 创建部署归档（模拟）
echo -e "${BLUE}=== 步骤 6: 创建部署归档（模拟） ===${NC}"
cd out
tar czf ../deploy-test.tar.gz . 2>/dev/null || {
  echo -e "${RED}❌ Failed to create archive${NC}"
  exit 1
}
cd ..
ARCHIVE_SIZE=$(ls -lh deploy-test.tar.gz | awk '{print $5}')
echo -e "${GREEN}✅ Archive created: deploy-test.tar.gz ($ARCHIVE_SIZE)${NC}"

# 显示归档内容预览
echo "📋 Archive contents preview:"
tar tzf deploy-test.tar.gz | head -30
echo ""

# 步骤 7: 验证归档内容
echo -e "${BLUE}=== 步骤 7: 验证归档内容 ===${NC}"
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"
tar xzf "$OLDPWD/deploy-test.tar.gz" 2>/dev/null || {
  echo -e "${RED}❌ Failed to extract archive${NC}"
  rm -rf "$TEMP_DIR"
  exit 1
}

echo "📁 Extracted directories:"
REQUIRED_DIRS=("about" "ai" "auth" "blog" "docs" "images" "login" "post" "practice" "404" "_next")
MISSING_IN_ARCHIVE=()
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    FILE_COUNT=$(find "$dir" -type f 2>/dev/null | wc -l)
    echo -e "  ${GREEN}✅ $dir/ ($FILE_COUNT files)${NC}"
  else
    echo -e "  ${RED}❌ $dir/ (missing in archive)${NC}"
    MISSING_IN_ARCHIVE+=("$dir")
  fi
done

if [ ${#MISSING_IN_ARCHIVE[@]} -gt 0 ]; then
  echo -e "${RED}❌ Missing directories in archive: ${MISSING_IN_ARCHIVE[*]}${NC}"
  rm -rf "$TEMP_DIR"
  rm -f "$OLDPWD/deploy-test.tar.gz"
  exit 1
fi

cd "$OLDPWD"
rm -rf "$TEMP_DIR"
echo -e "${GREEN}✅ Archive verification passed${NC}"
echo ""

# 清理测试归档
rm -f deploy-test.tar.gz
echo "🧹 清理测试归档文件"

# 总结
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ 所有测试通过！构建产物已准备就绪${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "📦 构建产物位置: out/"
echo "📊 文件统计:"
echo "  - 总文件数: $(find out -type f | wc -l)"
echo "  - 总目录数: $(find out -type d | wc -l)"
echo ""
echo "💡 下一步:"
echo "  1. 检查 out/ 目录确认所有文件正确生成"
echo "  2. 可以使用 'cd out && python3 -m http.server 8000' 测试静态文件"
echo "  3. 或使用 'pnpm start' 启动 Next.js 服务器（如果配置了）"
echo "  4. 确认无误后推送到 GitHub 触发 CI/CD"
