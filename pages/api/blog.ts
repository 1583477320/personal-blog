import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

const BLOG_DIR = 'Blog'
const SKIP_DIRS = new Set(['.obsidian', 'node_modules', '.git', '.trash'])
const SKIP_FILES = new Set(['README.md'])

export type BlogMeta = {
  title: string
  slug: string
  date: string
  tags: string[]
  category: string
  excerpt: string
  readTime: number
  views: number
  featured: boolean
}

/* ── 解析 frontmatter ── */
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { data: {}, body: raw }

  const data: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^\s*([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line)
    if (!kv) continue
    let value = kv[2].trim()
    // 去掉包裹引号
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

/* ── 归一化标签 ── */
function parseTags(raw?: string): string[] {
  if (!raw) return []
  return raw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim().replace(/^["'#]|["']$/g, ''))
    .filter(Boolean)
}

/* ── 递归收集 markdown ── */
function collect(dir: string, base: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && SKIP_DIRS.has(entry.name)) continue
    if (SKIP_DIRS.has(entry.name)) continue

    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collect(full, base, out)
    } else if (entry.name.toLowerCase().endsWith('.md') && !SKIP_FILES.has(entry.name)) {
      out.push(full)
    }
  }
  return out
}

/* ── 构建文章元数据 ── */
function buildPosts(contentRoot: string): BlogMeta[] {
  const blogRoot = path.join(contentRoot, BLOG_DIR)
  const files = collect(blogRoot, blogRoot)

  return files
    .map((full) => {
      const raw = fs.readFileSync(full, 'utf8')
      const { data, body } = parseFrontmatter(raw)

      // 跳过草稿
      if (data.draft === 'true') return null

      const rel = path.relative(blogRoot, full).replace(/\\/g, '/')
      const slug = `${BLOG_DIR}/${rel}`.replace(/\.md$/, '')

      const plain = body
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*_`~-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      const chars = body.replace(/\s/g, '').length
      const readTime = Math.max(1, Math.round(chars / 400))

      return {
        title: data.title || rel.replace(/\.md$/, ''),
        slug,
        date: data.date || fs.statSync(full).mtime.toISOString().slice(0, 10),
        tags: parseTags(data.tags),
        category: data.category || '技术博客',
        excerpt: data.description || plain.slice(0, 150) + (plain.length > 150 ? '…' : ''),
        readTime,
        views: Number(data.views || 0),
        featured: data.featured === 'true',
      } as BlogMeta
    })
    .filter((p): p is BlogMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const contentRoot = path.join(process.cwd(), 'content')

  /* ── GET：列表 / 详情 / 标签 ── */
  if (req.method === 'GET') {
    try {
      const all = buildPosts(contentRoot)

      // 标签汇总（不受筛选影响）
      const tags = Array.from(new Set(all.flatMap((p) => p.tags))).sort()

      const { slug, tag, search, page } = req.query

      // 单篇详情
      if (typeof slug === 'string' && slug) {
        const found = all.find((p) => p.slug === slug)
        if (!found) return res.status(404).json({ error: 'Post not found' })
        return res.status(200).json({ ...found, tags, total: all.length })
      }

      // 列表
      let list = all
      if (typeof tag === 'string' && tag && tag !== 'all') {
        list = list.filter((p) => p.tags.includes(tag))
      }
      if (typeof search === 'string' && search.trim()) {
        const q = search.trim().toLowerCase()
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
      }

      const perPage = 12
      const totalPages = Math.max(1, Math.ceil(list.length / perPage))
      const current = Math.min(Math.max(1, Number(page) || 1), totalPages)

      return res.status(200).json({
        posts: list.slice((current - 1) * perPage, current * perPage),
        total: list.length,
        totalPages,
        currentPage: current,
        tags,
      })
    } catch (err) {
      console.error('[api/blog] GET 失败:', err)
      return res.status(500).json({ error: 'Failed to read blog posts' })
    }
  }

  /* ── POST：阅读量 +1 ── */
  if (req.method === 'POST') {
    try {
      const { slug } = req.body || {}
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Slug is required' })
      }

      const file = path.join(contentRoot, `${slug}.md`)
      // 防目录穿越
      if (!file.startsWith(contentRoot) || !fs.existsSync(file)) {
        return res.status(404).json({ error: 'Post not found' })
      }

      const raw = fs.readFileSync(file, 'utf8')
      const { data } = parseFrontmatter(raw)
      const next = Number(data.views || 0) + 1

      let updated: string
      if (/^views\s*:/m.test(raw)) {
        updated = raw.replace(/^views\s*:.*$/m, `views: ${next}`)
      } else {
        // 无该字段：写入 frontmatter
        const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
        updated = m
          ? raw.replace(m[0], `---\n${m[1]}\nviews: ${next}\n---`)
          : `---\nviews: ${next}\n---\n\n${raw}`
      }

      fs.writeFileSync(file, updated, 'utf8')
      return res.status(200).json({ views: next })
    } catch (err) {
      console.error('[api/blog] POST 失败:', err)
      return res.status(500).json({ error: 'Failed to update views' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
