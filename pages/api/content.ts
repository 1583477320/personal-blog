import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

const SKIP_DIRS = new Set(['.obsidian', 'node_modules', '.git', '.trash'])

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { data: {}, body: raw }

  const data: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^\s*([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line)
    if (!kv) continue
    let value = kv[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[kv[1]] = value
  }
  return { data, body: raw.slice(m[0].length) }
}

function parseTags(raw?: string): string[] {
  if (!raw) return []
  return raw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim().replace(/^["'#]|["']$/g, ''))
    .filter(Boolean)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildToc(body: string) {
  const out: { level: number; text: string; id: string }[] = []
  const re = /^(#{2,3})\s+(.+)$/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    const text = m[2].trim()
    out.push({ level: m[1].length, text, id: slugify(text) })
  }
  return out
}

/* ── 建立维基链接索引：文件名/相对路径 → 相对路径 ── */
function collectFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectFiles(full, out)
    else if (entry.name.toLowerCase().endsWith('.md')) out.push(full)
  }
  return out
}

function buildLinkIndex(contentRoot: string): Map<string, string> {
  const index = new Map<string, string>()
  for (const full of collectFiles(contentRoot)) {
    const rel = path.relative(contentRoot, full).replace(/\\/g, '/')
    const noExt = rel.replace(/\.md$/, '')
    const base = noExt.split('/').pop()!

    // 优先级：完整相对路径 > 文件名
    if (!index.has(base)) index.set(base, noExt)
    index.set(noExt, noExt)
  }
  return index
}

/*
 * 把 Obsidian 的 [[链接]] 转换成标准 Markdown 链接。
 * 支持：[[Note]]、[[path/Note]]、[[Note|显示文本]]、[[Note#标题]]
 */
function resolveWikilinks(body: string, index: Map<string, string>): string {
  return body.replace(/\[\[([^\]\n]+?)\]\]/g, (whole, inner: string) => {
    const [targetPart, displayRaw] = inner.split('|')
    const [target, anchor] = targetPart.split('#')

    const key = target.trim().replace(/\.md$/, '')
    if (!key) return whole

    const resolved = index.get(key)
    const display = (displayRaw || target).trim()

    if (resolved) {
      const hash = anchor ? `#${slugify(anchor.trim())}` : ''
      return `[${display}](/read/${resolved.split('/').map(encodeURIComponent).join('/')}${hash})`
    }

    // 无法解析：保留为可读文本（不产生死链）
    return anchor ? `${display}（${anchor.trim()}）` : display
  })
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const contentRoot = path.join(process.cwd(), 'content')
    const { slug } = req.query

    if (typeof slug !== 'string' || !slug) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    const file = path.normalize(path.join(contentRoot, `${slug}.md`))

    // 防目录穿越
    if (!file.startsWith(contentRoot) || !fs.existsSync(file)) {
      return res.status(404).json({ error: 'Not found' })
    }

    const raw = fs.readFileSync(file, 'utf8')
    const { data, body } = parseFrontmatter(raw)

    const linkIndex = buildLinkIndex(contentRoot)
    const resolvedBody = resolveWikilinks(body, linkIndex)

    const rel = path.relative(contentRoot, file).replace(/\\/g, '/')
    const chars = body.replace(/\s/g, '').length

    return res.status(200).json({
      title: data.title || rel.split('/').pop()!.replace(/\.md$/, ''),
      date: data.date || fs.statSync(file).mtime.toISOString().slice(0, 10),
      tags: parseTags(data.tags),
      category: data.category || rel.split('/')[0] || '未分类',
      path: rel,
      content: resolvedBody,
      toc: buildToc(body),
      readTime: Math.max(1, Math.round(chars / 400)),
    })
  } catch (err) {
    console.error('[api/content] 失败:', err)
    return res.status(500).json({ error: 'Failed to read content' })
  }
}
