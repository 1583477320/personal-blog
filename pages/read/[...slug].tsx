import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Layout } from '../../components/Layout'
import {
  IconCalendar,
  IconClock,
  IconArrowLeft,
  IconLayers,
  IconMap,
} from '../../components/Icons'

type Doc = {
  title: string
  date: string
  tags: string[]
  category: string
  path: string
  content: string
  toc: { level: number; text: string; id: string }[]
  readTime: number
}

/* 与后端一致的锚点生成规则，保证目录可跳转 */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* 从子节点里提取纯文本，用于生成 heading id */
function textOf(node: any): string {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (typeof node === 'object' && node.props?.children) return textOf(node.props.children)
  return ''
}

export default function ReadPage() {
  const router = useRouter()
  const slugParts = router.query.slug
  const [doc, setDoc] = useState<Doc | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!router.isReady || !slugParts) return

    const slug = Array.isArray(slugParts) ? slugParts.join('/') : slugParts
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`)
        if (!res.ok) {
          if (!cancelled) setNotFound(true)
          return
        }
        const data = await res.json()
        if (cancelled) return
        if (data?.error) setNotFound(true)
        else setDoc(data)
      } catch (err) {
        console.error('加载失败:', err)
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [router.isReady, slugParts])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="w-16 h-16 bg-neo-mint border-4 border-black flex items-center justify-center mx-auto mb-6 animate-pulse -rotate-2">
            <IconLayers size={28} strokeWidth={3} className="text-black" />
          </div>
          <p className="font-mono text-sm uppercase tracking-widest text-black/60">正在加载</p>
        </div>
      </Layout>
    )
  }

  if (notFound || !doc) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="bg-white border-4 border-black shadow-neo p-12 md:p-16 -rotate-1">
            <h1 className="font-black uppercase text-4xl md:text-5xl mb-4">404</h1>
            <p className="font-mono text-sm md:text-base text-black/70 mb-8">
              找不到这篇笔记。
            </p>
            <Link href="/notes" className="nb-btn bg-neo-mint text-black">
              <IconArrowLeft size={18} strokeWidth={3} />
              返回笔记
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* 头部 */}
      <header className="bg-neo-mint border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest
                       border-[3px] border-black bg-white px-3 py-1.5 mb-8
                       hover:shadow-neo-sm hover:-translate-y-1 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <IconArrowLeft size={14} strokeWidth={3} />
            返回笔记
          </Link>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
              <IconCalendar size={12} strokeWidth={3} />
              {doc.date}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-neo-yellow border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
              <IconClock size={12} strokeWidth={3} />
              {doc.readTime} MIN
            </span>
            <span className="inline-flex items-center gap-1.5 bg-neo-coral border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold uppercase">
              <IconMap size={12} strokeWidth={3} />
              {doc.category}
            </span>
          </div>

          <h1 className="font-black uppercase text-3xl md:text-5xl text-black tracking-tighter leading-[0.95] mb-6">
            {doc.title}
          </h1>

          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-black text-white border-[3px] border-black px-3 py-1 font-mono text-xs font-bold uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 正文 */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
          {doc.toc.length > 2 && (
            <nav className="bg-white border-4 border-black p-5 md:p-6 mb-12 shadow-neo-sm">
              <h2 className="font-black uppercase text-sm tracking-widest mb-4">目录</h2>
              <ul className="space-y-2">
                {doc.toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'pl-5' : ''}>
                    <a
                      href={`#${item.id}`}
                      className="font-mono text-xs md:text-sm text-black/70 hover:text-neo-coral
                                 transition-colors duration-200 inline-flex items-start gap-2"
                    >
                      <span className="inline-block w-2 h-2 bg-neo-cyan mt-1.5 shrink-0" />
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <article className="nb-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 id={slugify(textOf(children))} className="scroll-mt-24">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 id={slugify(textOf(children))} className="scroll-mt-24">
                    {children}
                  </h3>
                ),
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </article>

          <div className="mt-16 pt-8 border-t-4 border-black flex flex-wrap gap-4 items-center justify-between">
            <Link href="/notes" className="nb-btn bg-neo-mint text-black">
              <IconArrowLeft size={18} strokeWidth={3} />
              返回笔记
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="nb-btn bg-white text-black"
            >
              回到顶部
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
