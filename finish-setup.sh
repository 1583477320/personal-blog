#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════
#  finish-setup.sh — 完成方案 B（Git 子模块 + Vercel）
#
#  前置条件：先执行 `gh auth login` 完成 GitHub 授权
#  本脚本幂等，可重复执行
# ══════════════════════════════════════════════════════════
set -euo pipefail

VAULT_DIR="/d/obsdidian file/学习"
SITE_DIR="/c/Users/xiaozhu/projects/flowershow-site"
VAULT_REPO_NAME="obsidian-notes"

echo "══════════ 1/5 检查 GitHub 授权 ══════════"
if ! gh auth status >/dev/null 2>&1; then
  echo "❌ 尚未登录 GitHub。请先执行：  gh auth login"
  exit 1
fi
GH_USER="$(gh api user --jq .login)"
echo "✅ 已登录为：$GH_USER"

REMOTE_URL="https://github.com/${GH_USER}/${VAULT_REPO_NAME}.git"

echo ""
echo "══════════ 2/5 创建远程仓库（如已存在则跳过）══════════"
if gh repo view "${GH_USER}/${VAULT_REPO_NAME}" >/dev/null 2>&1; then
  echo "✅ 仓库已存在：${GH_USER}/${VAULT_REPO_NAME}"
else
  gh repo create "${VAULT_REPO_NAME}" \
    --public \
    --description "技术笔记（Obsidian vault）— 已排除私密内容" \
    --disable-wiki 2>&1 | tail -2
  echo "✅ 已创建公开仓库"
fi

echo ""
echo "══════════ 3/5 推送 vault ══════════"
cd "$VAULT_DIR"
# 安全检查：确认 .gitignore 仍在，避免误推私密内容
if [ ! -f .gitignore ]; then
  echo "❌ 缺少 .gitignore，中止以防泄露私密内容！"
  exit 1
fi
if git ls-files | grep -qE '^(日记|会议摘要|项目|论文|职业|每日任务|配置)/'; then
  echo "❌ 检测到私密目录已被追踪，中止！"
  exit 1
fi
echo "✅ 安全检查通过（私密目录未被追踪）"

git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"
git branch -M main
git push -u origin main 2>&1 | tail -3
echo "✅ vault 已推送 → $REMOTE_URL"

echo ""
echo "══════════ 4/5 将 content 转为 git submodule ══════════"
cd "$SITE_DIR"

# 前置断言：确认 vault 已成功推送到远程，才动本地联接
# （即便本地操作出问题，GitHub 上已有完整副本）
if ! git ls-remote "$REMOTE_URL" main >/dev/null 2>&1; then
  echo "❌ 远程仓库尚无 main 分支，拒绝删除本地联接。"
  exit 1
fi
echo "✅ 远程已确认有 main 分支（内容已安全备份）"

# 关键：content 是 Windows 目录联接（junction）
# 必须只删除重解析点本身 —— 绝不能用 rm -rf（会递归删除源笔记！）
if [ -e content ]; then
  LINK_TYPE="$(powershell -Command "(Get-Item 'content' -Force).LinkType" 2>/dev/null | tr -d '\r')"
  echo "→ content 类型: ${LINK_TYPE:-普通目录}"

  if [ "$LINK_TYPE" = "Junction" ] || [ "$LINK_TYPE" = "SymbolicLink" ]; then
    # .NET DirectoryInfo.Delete() 对联接只移除重解析点，不递归目标
    powershell -Command "(Get-Item 'content' -Force).Delete()" 2>&1 | tail -1
  else
    echo "⚠️ content 非联接，可能是实体目录，改为移入回收站路径备份"
    mv content "content.bak.$(date +%s)"
  fi
fi

# 断言：源笔记必须完好无损
VAULT_COUNT="$(find "$VAULT_DIR" -name '*.md' -not -path '*/.obsidian/*' | wc -l)"
if [ "$VAULT_COUNT" -lt 100 ]; then
  echo "❌ 危险：源笔记数量异常（仅 $VAULT_COUNT 个），中止！"
  exit 1
fi
echo "✅ 源笔记完好（$VAULT_COUNT 个 .md 文件）"
echo "✅ content 联接已安全移除"

# 移除可能残留的索引
git rm -r --cached content 2>/dev/null || true
rm -rf .git/modules/content 2>/dev/null || true

git submodule add "$REMOTE_URL" content 2>&1 | tail -2
git commit -q -m "chore: content 挂载为 git submodule（obsidian-notes）" 2>&1 | tail -1 || true
echo "✅ submodule 已挂载"

echo ""
echo "══════════ 5/5 验证 ══════════"
echo "submodule 状态："
git submodule status
echo ""
echo "内容文件数：$(find content -name '*.md' -not -path '*/.obsidian/*' 2>/dev/null | wc -l)"
echo ""
echo "══════════════════════════════════════════"
echo "✅ 方案 B 配置完成。"
echo ""
echo "下一步部署（需你在浏览器完成 Vercel 授权）："
echo "  cd $SITE_DIR"
echo "  npx vercel login"
echo "  npx vercel --prod"
echo "══════════════════════════════════════════"
