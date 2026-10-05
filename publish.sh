#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════
#  publish.sh — 一键发布
#  用法：双击「发布网站.bat」，或在终端执行 bash publish.sh
#
#  流程：提交笔记 → 推送GitHub(可选) → 同步content → 部署Vercel
#  关键：content 从本地 vault 直接同步，不依赖被阻断的 github.com
# ══════════════════════════════════════════════════════════
set -uo pipefail

VAULT_UNIX="/d/obsdidian file/学习"
VAULT_WIN="D:/obsdidian file/学习"
SITE_UNIX="/c/Users/xiaozhu/projects/flowershow-site"

STAMP="$(date '+%Y-%m-%d %H:%M')"

echo ""
echo "══════════ 1/4  提交笔记改动 ══════════"
cd "$VAULT_UNIX" || exit 1
if [ -n "$(git status --porcelain)" ]; then
  git add -A && git commit -q -m "更新笔记 $STAMP"
  echo "✅ 已提交（$(git rev-parse --short HEAD)）"
else
  echo "（笔记无改动）"
fi

echo ""
echo "══════════ 2/4  推送笔记到 GitHub（备份，可选）══════════"
if timeout 45 git push origin main 2>/dev/null; then
  echo "✅ 已推送"
else
  echo "⚠️  GitHub 不通，跳过 —— 不影响发布"
fi

echo ""
echo "══════════ 3/4  同步 content ══════════"
cd "$SITE_UNIX/content" || exit 1
if ! timeout 30 git fetch "$VAULT_WIN" main 2>&1 | tail -1; then
  echo "❌ 同步失败，中止"; exit 1
fi
git reset --hard FETCH_HEAD -q
echo "✅ content 已同步到 $(git rev-parse --short HEAD)"

cd "$SITE_UNIX" || exit 1
if [ -n "$(git status --porcelain)" ]; then
  git add content && git commit -q -m "同步笔记 $STAMP"
  echo "✅ 子模块指针已更新"
  timeout 45 git push origin main 2>/dev/null && echo "✅ 站点仓库已推送" || echo "⚠️  GitHub 不通，跳过"
else
  echo "（内容无变化）"
fi

echo ""
echo "══════════ 4/4  部署到 Vercel ══════════"
npx --yes vercel --prod --yes 2>&1 | grep -iE 'Production:|error|ready|https://' | tail -5

echo ""
echo "══════════════════════════════════════════"
echo "✅ 发布完成"
echo "   站点：https://personal-blog-self-delta.vercel.app"
echo "══════════════════════════════════════════"
