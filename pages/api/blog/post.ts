import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

const BLOG_DIR = 'Blog'

/* ── 解析 frontmatter ── */
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

/* ── 生成目录锚点 ── */
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

    const file = path.join(contentRoot, `${slug}.md`)

    // 防目录穿越 + 必须位于 Blog 目录内
    const normalized = path.normalize(file)
    if (
      !normalized.startsWith(contentRoot) ||
      !path.normalize(path.join(contentRoot, BLOG_DIR)).startsWith(contentRoot) ||
      !normalized.includes(`${path.sep}${BLOG_DIR}${path.sep}`) ||
      !fs.existsSync(normalized)
    ) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const raw = fs.readFileSync(normalized, 'utf8')
    const { data, body } = parseFrontmatter(raw)

    if (data.draft === 'true') {
      return res.status(404).json({ error: 'Post not found' })
    }

    const chars = body.replace(/\s/g, '').length
    const rel = path.relative(path.join(contentRoot, BLOG_DIR), normalized).replace(/\\/g, '/')

    return res.status(200).json({
      title: data.title || rel.replace(/\.md$/, ''),
      date: data.date || fs.statSync(normalized).mtime.toISOString().slice(0, 10),
      tags: parseTags(data.tags),
      category: data.category || '技术博客',
      description: data.description || '',
      content: body,
      toc: buildToc(body),
      readTime: Math.max(1, Math.round(chars / 400)),
      views: Number(data.views || 0),
    })
  } catch (err) {
    console.error('[api/blog/post] 失败:', err)
    return res.status(500).json({ error: 'Failed to read post' })
  }
}
