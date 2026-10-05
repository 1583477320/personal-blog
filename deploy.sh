#!/bin/bash
# Flowershow 网站一键部署脚本

echo "🚀 开始部署到 Vercel..."
echo "================================"
echo ""

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 flowershow-site 目录下运行此脚本"
    exit 1
fi

# 检查是否安装 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "1️⃣  构建生产版本..."
npm run build

echo ""
echo "2️⃣  登录 Vercel（首次使用）..."
echo "   如果已登录可跳过此步骤"
vercel login

echo ""
echo "3️⃣  部署到预览环境..."
vercel

echo ""
echo "4️⃣  部署到生产环境..."
vercel --prod

echo ""
echo "================================"
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
vercel ls | grep -i prod || echo "在生产环境中查看"
echo ""
echo "💡 提示："
echo "   - 可以使用自定义域名"
echo "   - 设置 GitHub 集成实现自动部署"
echo "   - 在 Dashboard 查看部署历史"
echo ""
