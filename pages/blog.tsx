import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { slugToHref } from '../lib/url'
import {
  IconSearch,
  IconCalendar,
  IconClock,
  IconEye,
  IconArrowRight,
  IconFileText,
} from '../components/Icons'

type Post = {
  title: string
  slug: string
  date: string
  tags: string[]
  category: string
  excerpt: string
  views: number
  readTime: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedTag !== 'all') params.set('tag', selectedTag)
        if (searchQuery) params.set('search', searchQuery)

        const res = await fetch(`/api/blog?${params.toString()}`)
        const data = await res.json()
        if (cancelled) return

        setPosts(data.posts || [])
        // 保留全量标签：仅在未筛选时更新
        if (selectedTag === 'all' && !searchQuery) {
          setTags(data.tags || [])
        }
      } catch (err) {
        console.error('加载文章失败:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [selectedTag, searchQuery])

  return (
    <Layout>
      {/* 页头 */}
      <section className="bg-neo-mint border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 mb-6 shadow-neo-sm -rotate-1">
            <IconFileText size={14} strokeWidth={3} className="text-black" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              Blog Archive
            </span>
          </div>
          <h1 className="font-black uppercase text-4xl md:text-6xl text-black tracking-tighter mb-4">
            技术博客
          </h1>
          <p className="font-mono text-sm md:text-base text-black/70 max-w-xl">
            记录技术探索之路 —— 大模型工程、算法实践、系统笔记。
          </p>
        </div>
      </section>

      {/* 搜索 + 筛选 */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 搜索框 */}
            <div className="lg:w-96 shrink-0">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60 block mb-2">
                搜索
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none">
                  <IconSearch size={18} strokeWidth={3} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入关键词..."
                  className="nb-input pl-12"
                />
              </div>
            </div>

            {/* 标签 */}
            <div className="flex-1 min-w-0">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60 block mb-2">
                标签筛选
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={[
                    'nb-chip',
                    selectedTag === 'all'
                      ? 'bg-neo-red text-black shadow-neo-sm'
                      : 'bg-white text-black',
                  ].join(' ')}
                >
                  全部
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={[
                      'nb-chip',
                      selectedTag === tag
                        ? 'bg-neo-cyan text-black shadow-neo-sm'
                        : 'bg-white text-black',
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

      {/* 文章列表 */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          {/* 结果计数 */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-black/60">
              共 {posts.length} 篇
            </span>
            {(selectedTag !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTag('all')
                  setSearchQuery('')
                }}
                className="font-mono text-xs font-bold uppercase tracking-widest
                           border-[3px] border-black bg-neo-yellow px-3 py-1.5
                           hover:shadow-neo-sm hover:-translate-y-1 transition-all duration-300"
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                清除筛选
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-4 border-black bg-white p-6 h-52 animate-pulse"
                >
                  <div className="w-24 h-6 bg-black/10 mb-6" />
                  <div className="w-3/4 h-8 bg-black/10 mb-4" />
                  <div className="w-full h-4 bg-black/10 mb-2" />
                  <div className="w-2/3 h-4 bg-black/10" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="border-4 border-black border-dashed bg-white p-12 md:p-20 text-center">
              <div className="w-16 h-16 bg-neo-yellow border-4 border-black flex items-center justify-center mx-auto mb-6 rotate-2">
                <IconSearch size={28} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-black uppercase text-xl md:text-2xl mb-3">
                没有匹配的文章
              </h3>
              <p className="font-mono text-sm text-black/60">
                试试其他关键词，或清除筛选条件。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={slugToHref('/blog', post.slug)}
                  className="bg-white border-4 border-black rounded-none p-6 md:p-7 shadow-neo
                             transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                             active:scale-[0.97] group flex flex-col"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  {/* 元信息 */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-neo-yellow border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
                      <IconCalendar size={12} strokeWidth={3} />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-neo-cyan border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
                      <IconClock size={12} strokeWidth={3} />
                      {post.readTime} MIN
                    </span>
                  </div>

                  <h2 className="font-black uppercase text-xl md:text-2xl text-black mb-3 tracking-tight
                                 group-hover:text-neo-coral transition-colors duration-200">
                    {post.title}
                  </h2>

                  <p className="font-mono text-sm text-neutral-700 leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t-[3px] border-black/10 flex-wrap gap-3">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-neo-coral border-[3px] border-black px-2 py-0.5 font-mono text-xs font-bold uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase">
                      <IconEye size={13} strokeWidth={3} />
                      {post.views}
                      <IconArrowRight size={13} strokeWidth={3} className="ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
