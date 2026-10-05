# 部署指南

> 当前状态：本地完全就绪，仅剩登录授权这一步需要你在浏览器完成。

---

## 一、已完成

| 项目 | 状态 |
|------|------|
| Obsidian 笔记仓库 | https://github.com/1583477320/obsidian-notes （已推送，API 验证通过） |
| 内容边界 | 仅技术类；私密目录与 API Key 已排除（远程回读验证） |
| 站点本地仓库 | 已提交，content 挂载为 git submodule |
| 构建 | `npm run build` 通过，类型检查通过 |
| Serverless 打包 | 已配置 `outputFileTracingIncludes`，API 可读到 content |

### 已排除的内容（不发布）

`日记/`（含恋爱日记）· `会议摘要/`（审稿意见）· `项目/`
`论文/`（未发表研究）· `职业/` · `每日任务/` · `配置/` · `.obsidian/`
`LLM工程学习记录/AgnesAI域名DNS污染问题排查与修复.md`（含真实 API Key）

---

## 二、待你完成：Vercel 授权

GitHub OAuth 走不通（`github.com` 当前被网络阻断），请用**邮箱登录**：

```bash
cd C:\Users\xiaozhu\projects\flowershow-site
npx vercel login
```

菜单里选 `Continue with Email`，填入你的邮箱，收到确认邮件后点链接即完成。

---

## 三、部署

授权完成后：

```bash
cd C:\Users\xiaozhu\projects\flowershow-site
npx vercel --prod
```

首次运行会问几个问题，按下面回答：

| 提问 | 回答 |
|------|------|
| Set up and deploy? | `Y` |
| Which scope? | 选你自己的账号 |
| Link to existing project? | `N` |
| Project name? | `personal-blog` |
| In which directory is your code? | 直接回车（`./`） |
| Want to modify settings? | `N` |

完成后会输出形如 `https://personal-blog-xxxx.vercel.app` 的网址。

---

## 四、后续更新笔记

笔记改动后需要**推送 vault + 更新子模块引用**：

```bash
# 1. 推送笔记
cd "D:\obsdidian file\学习"
git add -A && git commit -m "更新笔记"
git push

# 2. 更新站点里的子模块指针
cd C:\Users\xiaozhu\projects\flowershow-site
git submodule update --remote content
git commit -am "chore: 同步笔记"
git push

# 3. 重新部署
npx vercel --prod
```

> 提示：笔记里新增的敏感内容，记得同步加进 `D:\obsdidian file\学习\.gitignore`。

---

## 五、已知限制

- **阅读量无法持久化**：Vercel 文件系统只读，`POST /api/blog` 已改为优雅降级
  （返回当前值而不报错）。若要真实统计，需接入 Vercel KV 或数据库。
- **站点仓库推送受阻**：`github.com:443` 当前不通，`personal-blog` 仓库已创建
  但站点代码尚未推上去。网络恢复后执行 `git push -u origin main` 即可。
  这不影响 CLI 部署。
- **新笔记需重新部署**：`/blog/[...slug]` 与 `/read/[...slug]` 是构建期预渲染，
  新增文章后要重跑 `npx vercel --prod`。

---

## 六、网络诊断结论

```
api.github.com  → 200   ✅（gh 命令可用）
github.com      → 000   ❌（git push 受阻）
vercel.com      → 200   ✅（部署可行）
```

因此选定**绕开 GitHub 集成、走 Vercel CLI 直传**的部署路径。
