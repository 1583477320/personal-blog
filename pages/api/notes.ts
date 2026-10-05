import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

const SKIP_DIRS = new Set(['.obsidian', 'node_modules', '.git', '.trash', 'Blog'])
const SKIP_FILES = new Set(['README.md'])

type Note = {
  title: string
  slug: string
  path: string
  date: string
  tags: string[]
  category: string
  excerpt: string
}

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

function collect(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collect(full, out)
    } else if (entry.name.toLowerCase().endsWith('.md') && !SKIP_FILES.has(entry.name)) {
      out.push(full)
    }
  }
  return out
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const contentRoot = path.join(process.cwd(), 'content')

    const notes: Note[] = collect(contentRoot).map((full) => {
      const raw = fs.readFileSync(full, 'utf8')
      const { data, body } = parseFrontmatter(raw)

      const rel = path.relative(contentRoot, full).replace(/\\/g, '/')
      const slug = rel.replace(/\.md$/, '')

      const plain = body
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*_`~]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      return {
        title: data.title || rel.split('/').pop()!.replace(/\.md$/, ''),
        slug,
        path: rel,
        date: data.date || fs.statSync(full).mtime.toISOString().slice(0, 10),
        tags: parseTags(data.tags),
        category: data.category || rel.split('/')[0] || '未分类',
        excerpt: plain.slice(0, 140),
      }
    })

    notes.sort((a, b) => (a.path < b.path ? -1 : 1))
    return res.status(200).json(notes)
  } catch (err) {
    console.error('[api/notes] 失败:', err)
    return res.status(500).json({ error: 'Failed to read notes' })
  }
}
