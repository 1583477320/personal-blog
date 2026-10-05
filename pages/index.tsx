import Link from 'next/link'
import { Layout } from '../components/Layout'
import { slugToHref } from '../lib/url'
import {
  IconCpu,
  IconCode,
  IconTarget,
  IconArrowRight,
  IconZap,
  IconLayers,
  IconMap,
} from '../components/Icons'

const DOMAINS = [
  {
    icon: IconCpu,
    title: 'AI & LLM',
    desc: 'Transformer 架构、模型微调、推理优化、Agent 系统设计。',
    color: 'bg-neo-yellow',
    shadow: 'shadow-neo-yellow',
    rotate: '-1deg',
  },
  {
    icon: IconCode,
    title: '算法题解',
    desc: 'LeetCode 链表、二叉树、动态规划、滑动窗口等经典题型。',
    color: 'bg-neo-cyan',
    shadow: 'shadow-neo-cyan',
    rotate: '1deg',
  },
  {
    icon: IconTarget,
    title: '职业成长',
    desc: 'Agent 工程师学习路径、岗位调研、面试准备与技能提升。',
    color: 'bg-neo-coral',
    shadow: 'shadow-neo-red',
    rotate: '-1deg',
  },
]

const STATS = [
  { value: '135+', label: '技术笔记', bg: 'bg-neo-yellow' },
  { value: '50+', label: '算法题解', bg: 'bg-neo-cyan' },
  { value: '10+', label: '技术方案', bg: 'bg-neo-mint' },
  { value: '365', label: '天学习', bg: 'bg-neo-coral' },
]

const FEATURED = [
  {
    slug: 'Blog/初探 Transformer 架构：从理论到实践',
    title: '初探 Transformer 架构',
    desc: '自注意力机制、多头注意力、位置编码的原理与代码实现。',
    date: '2026.10.05',
    tag: 'AI',
    bg: 'bg-neo-yellow',
  },
]

export default function Home() {
  return (
    <Layout>
      {/* ══ HERO ══ */}
      <section className="border-b-4 border-black bg-neo-yellow">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl">
            {/* 徽章 */}
            <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 mb-8 shadow-neo-sm -rotate-2">
              <span className="inline-block w-3 h-3 bg-neo-red" />
              <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest">
                Neo-Brutalist Playful
              </span>
            </div>

            <h1
              className="font-black uppercase leading-[0.92] tracking-tighter text-black
                         text-5xl md:text-7xl lg:text-8xl mb-8"
            >
              数字花园
              <br />
              <span className="inline-block bg-white border-4 border-black px-3 md:px-5 py-1 md:py-2 shadow-neo rotate-1 mt-3">
                持续生长
              </span>
            </h1>

            <p className="font-mono text-sm md:text-base text-black/80 max-w-xl mb-10 leading-relaxed">
              AI 工程师 / 技术探索者 / 持续学习者。
              <br className="hidden md:block" />
              这里记录大模型工程、算法题解与系统实践的全部过程。
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/blog" className="nb-btn bg-neo-red text-black">
                阅读博客
                <IconArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link href="/notes" className="nb-btn bg-white text-black">
                浏览笔记
                <IconLayers size={18} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 数据统计条 ══ */}
      <section className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} border-4 border-black rounded-none p-4 md:p-6 shadow-neo
                            transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                            active:scale-95`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <div className="font-black text-3xl md:text-4xl text-black leading-none mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs md:text-sm font-bold uppercase text-black/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 探索领域 ══ */}
      <section className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
            <h2 className="font-black uppercase text-3xl md:text-5xl text-black tracking-tight">
              探索领域
            </h2>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest text-black/50">
              / 03 Domains
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {DOMAINS.map((d) => {
              const Icon = d.icon
              return (
                <article
                  key={d.title}
                  className="bg-white border-4 border-black rounded-none p-6 md:p-7 shadow-neo
                             transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                             active:scale-[0.97] group"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <div
                    className={`${d.color} w-14 h-14 border-4 border-black flex items-center justify-center mb-6
                                transition-all duration-300 group-hover:-translate-y-1`}
                    style={{ transform: `rotate(${d.rotate})`, transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    <Icon size={26} strokeWidth={3} className="text-black" />
                  </div>

                  <h3 className="font-black uppercase text-xl md:text-2xl text-black mb-3 tracking-tight">
                    {d.title}
                  </h3>
                  <p className="font-mono text-sm text-neutral-700 leading-relaxed">
                    {d.desc}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ 最新文章 ══ */}
      <section className="border-b-4 border-black bg-neo-cyan">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
            <h2 className="font-black uppercase text-3xl md:text-5xl text-black tracking-tight">
              最新文章
            </h2>
            <Link
              href="/blog"
              className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest
                         border-4 border-black bg-white px-4 py-2 shadow-neo-sm
                         hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                         transition-all duration-300"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              查看全部
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FEATURED.map((post) => (
              <Link
                key={post.title}
                href={slugToHref('/blog', post.slug)}
                className="bg-white border-4 border-black rounded-none p-6 md:p-7 shadow-neo
                           transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                           active:scale-[0.97] group block"
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`${post.bg} border-[3px] border-black px-3 py-1 font-mono text-xs font-bold uppercase`}>
                    {post.tag}
                  </span>
                  <span className="font-mono text-xs text-neutral-600">{post.date}</span>
                </div>

                <h3 className="font-black uppercase text-xl md:text-2xl text-black mb-3 tracking-tight
                               group-hover:text-neo-coral transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="font-mono text-sm text-neutral-700 leading-relaxed mb-6">
                  {post.desc}
                </p>

                <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase
                                 border-b-[3px] border-black pb-1">
                  阅读全文
                  <IconArrowRight size={14} strokeWidth={3} />
                </span>
              </Link>
            ))}

            {/* 占位提示卡 */}
            <div className="bg-white/40 border-4 border-black border-dashed rounded-none p-6 md:p-7
                            flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center mb-4 rotate-2">
                <IconZap size={22} strokeWidth={3} className="text-black" />
              </div>
              <p className="font-mono text-xs md:text-sm text-black/60 uppercase tracking-widest">
                更多文章持续更新中
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="bg-black border-4 border-black rounded-none p-8 md:p-14 shadow-neo-lg text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-neo-yellow border-4 border-white mb-6 -rotate-2">
              <IconMap size={26} strokeWidth={3} className="text-black" />
            </div>
            <h2 className="font-black uppercase text-3xl md:text-5xl text-white tracking-tight mb-5">
              开始探索
            </h2>
            <p className="font-mono text-sm md:text-base text-neutral-400 max-w-lg mx-auto mb-8 leading-relaxed">
              从知识笔记到技术博客，所有内容都可以自由查阅。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/notes" className="nb-btn bg-neo-yellow text-black">
                知识笔记
              </Link>
              <Link href="/about" className="nb-btn bg-neo-cyan text-black">
                关于我
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
