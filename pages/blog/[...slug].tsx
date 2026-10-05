import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Layout } from '../../components/Layout'
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconArrowLeft,
  IconFileText,
} from '../../components/Icons'

type Post = {
  title: string
  date: string
  tags: string[]
  category?: string
  description?: string
  content: string
  readTime: number
  views: number
  toc?: { level: number; text: string; id: string }[]
}

export default function BlogPostPage() {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  // catch-all 路由：slug 可能是数组，需拼回完整路径
  const slugParam = router.query.slug
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam

  useEffect(() => {
    if (!router.isReady || !slug) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await fetch(`/api/blog/post?slug=${encodeURIComponent(String(slug))}`)
        if (!res.ok) {
          if (!cancelled) setNotFound(true)
          return
        }
        const data = await res.json()
        if (cancelled) return
        if (data?.error) {
          setNotFound(true)
        } else {
          setPost(data)
          // 记录阅读量（失败不影响展示）
          fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          }).catch(() => {})
        }
      } catch (err) {
        console.error('加载文章失败:', err)
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [router.isReady, slug])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 剪贴板不可用时忽略 */
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="w-16 h-16 bg-neo-yellow border-4 border-black flex items-center justify-center mx-auto mb-6 animate-pulse -rotate-2">
            <IconFileText size={28} strokeWidth={3} className="text-black" />
          </div>
          <p className="font-mono text-sm uppercase tracking-widest text-black/60">正在加载文章</p>
        </div>
      </Layout>
    )
  }

  if (notFound || !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="bg-white border-4 border-black shadow-neo p-12 md:p-16 -rotate-1">
            <h1 className="font-black uppercase text-4xl md:text-5xl mb-4">404</h1>
            <p className="font-mono text-sm md:text-base text-black/70 mb-8">
              这篇文章不存在，或者已经被移动了。
            </p>
            <Link href="/blog" className="nb-btn bg-neo-cyan text-black">
              <IconArrowLeft size={18} strokeWidth={3} />
              返回博客
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <header className="bg-neo-yellow border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest
                       border-[3px] border-black bg-white px-3 py-1.5 mb-8
                       hover:shadow-neo-sm hover:-translate-y-1 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <IconArrowLeft size={14} strokeWidth={3} />
            返回博客
          </Link>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
              <IconCalendar size={12} strokeWidth={3} />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-neo-cyan border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
              <IconClock size={12} strokeWidth={3} />
              {post.readTime} MIN READ
            </span>
            <span className="inline-flex items-center gap-1.5 bg-neo-coral border-[3px] border-black px-2.5 py-1 font-mono text-xs font-bold">
              <IconEye size={12} strokeWidth={3} />
              {post.views} VIEWS
            </span>
          </div>

          <h1 className="font-black uppercase text-3xl md:text-5xl lg:text-6xl text-black
                         tracking-tighter leading-[0.95] mb-6">
            {post.title}
          </h1>

          {post.description && (
            <p className="font-mono text-sm md:text-base text-black/75 max-w-2xl leading-relaxed mb-6">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-black text-white border-[3px] border-black px-3 py-1
                           font-mono text-xs font-bold uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <article className="nb-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>

          <div className="mt-16 pt-8 border-t-4 border-black flex flex-wrap gap-4 items-center justify-between">
            <Link href="/blog" className="nb-btn bg-neo-cyan text-black">
              <IconArrowLeft size={18} strokeWidth={3} />
              返回博客
            </Link>

            <div className="flex flex-wrap gap-3">
              <button onClick={copyLink} className="nb-btn bg-neo-yellow text-black">
                {copied ? '已复制链接' : '分享链接'}
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="nb-btn bg-white text-black"
              >
                回到顶部
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
