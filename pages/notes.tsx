import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { slugToHref } from '../lib/url'
import { IconSearch, IconLayers, IconArrowRight } from '../components/Icons'

type Note = {
  title: string
  slug: string
  path: string
  date: string
  tags: string[]
  category: string
  excerpt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filtered, setFiltered] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')

  useEffect(() => {
    let cancelled = false
    fetch('/api/notes')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const list: Note[] = Array.isArray(data) ? data : []
        setNotes(list)
        setFiltered(list)
      })
      .catch((err) => console.error('加载笔记失败:', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])))

  useEffect(() => {
    let result = notes
    if (selectedTag !== 'all') {
      result = result.filter((n) => n.tags?.includes(selectedTag))
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.path.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    setFiltered(result)
  }, [query, selectedTag, notes])

  return (
    <Layout>
      {/* 页头 */}
      <section className="bg-neo-mint border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 mb-6 shadow-neo-sm -rotate-1">
            <IconLayers size={14} strokeWidth={3} className="text-black" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              Knowledge Base
            </span>
          </div>
          <h1 className="font-black uppercase text-4xl md:text-6xl text-black tracking-tighter mb-4">
            知识笔记
          </h1>
          <p className="font-mono text-sm md:text-base text-black/70 max-w-xl">
            从 Obsidian 知识库同步的原始笔记 —— 学习过程与踩坑记录。
          </p>
        </div>
      </section>

      {/* 搜索 + 标签 */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60 block mb-2">
                搜索笔记
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none">
                  <IconSearch size={18} strokeWidth={3} />
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="标题 / 路径 / 标签..."
                  className="nb-input pl-12"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60 block mb-2">
                标签
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={[
                    'nb-chip',
                    selectedTag === 'all' ? 'bg-neo-red text-black shadow-neo-sm' : 'bg-white text-black',
                  ].join(' ')}
                >
                  全部
                </button>
                {allTags.slice(0, 14).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={[
                      'nb-chip',
                      selectedTag === tag ? 'bg-neo-yellow text-black shadow-neo-sm' : 'bg-white text-black',
                    ].join(' ')}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 列表 */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="mb-8">
            <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-black/60">
              共 {filtered.length} / {notes.length} 条笔记
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-4 border-black bg-white p-6 h-40 animate-pulse">
                  <div className="w-2/3 h-6 bg-black/10 mb-4" />
                  <div className="w-full h-4 bg-black/10" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-4 border-black border-dashed bg-white p-12 md:p-20 text-center">
              <div className="w-16 h-16 bg-neo-yellow border-4 border-black flex items-center justify-center mx-auto mb-6 rotate-2">
                <IconSearch size={28} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-black uppercase text-xl md:text-2xl mb-3">没有匹配的笔记</h3>
              <p className="font-mono text-sm text-black/60">试试其他关键词。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((note) => (
                <div
                  key={note.path}
                  className="bg-white border-4 border-black rounded-none p-5 md:p-6 shadow-neo
                             transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                             active:scale-[0.97] flex flex-col"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-black/50 mb-3 truncate">
                    {note.path.replace(/\.md$/, '')}
                  </span>

                  <h3 className="font-black uppercase text-base md:text-lg text-black mb-4 leading-tight flex-1">
                    {note.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(note.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-neo-mint border-[3px] border-black px-2 py-0.5 font-mono text-[11px] font-bold uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={slugToHref('/read', note.slug)}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase
                               border-b-[3px] border-black pb-1 self-start
                               hover:text-neo-coral transition-colors duration-200"
                  >
                    阅读
                    <IconArrowRight size={13} strokeWidth={3} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
