import Link from 'next/link'
import { Layout } from '../components/Layout'
import {
  IconCpu,
  IconCode,
  IconTarget,
  IconLayers,
  IconZap,
  IconMap,
  IconArrowRight,
} from '../components/Icons'

const SKILLS = [
  { name: 'Python', level: 92, bg: 'bg-neo-yellow' },
  { name: 'TypeScript', level: 80, bg: 'bg-neo-cyan' },
  { name: 'C++', level: 72, bg: 'bg-neo-mint' },
  { name: 'Rust', level: 55, bg: 'bg-neo-coral' },
]

const STACK = [
  {
    group: 'AI / ML',
    items: ['PyTorch', 'Hugging Face', 'LangChain', 'llama.cpp'],
    bg: 'bg-neo-yellow',
  },
  {
    group: 'Web',
    items: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    bg: 'bg-neo-cyan',
  },
  {
    group: '系统',
    items: ['Linux', 'Docker', 'Git', 'Nginx'],
    bg: 'bg-neo-mint',
  },
  {
    group: '知识管理',
    items: ['Obsidian', 'Quartz', 'Markdown'],
    bg: 'bg-neo-coral',
  },
]

const TIMELINE = [
  {
    phase: '研一',
    title: '打基础',
    items: ['算法与数据结构（LeetCode 100+）', 'Python 工程能力', '数学基础'],
    bg: 'bg-neo-yellow',
  },
  {
    phase: '研二',
    title: '专业化',
    items: ['大模型与深度学习', 'Agent 工程师技能栈', '科研项目实践'],
    bg: 'bg-neo-cyan',
  },
  {
    phase: '未来',
    title: '职业发展',
    items: ['实习经历积累', '技术博客沉淀', '求职准备'],
    bg: 'bg-neo-coral',
  },
]

export default function AboutPage() {
  return (
    <Layout>
      {/* 页头 */}
      <section className="bg-neo-coral border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 mb-6 shadow-neo-sm -rotate-1">
            <IconMap size={14} strokeWidth={3} className="text-black" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest">About</span>
          </div>
          <h1 className="font-black uppercase text-4xl md:text-6xl text-black tracking-tighter mb-4">
            关于我
          </h1>
          <p className="font-mono text-sm md:text-base text-black/75 max-w-2xl leading-relaxed">
            研二学生，在重庆读书。专注 AI 工程方向 —— 从大模型原理到 Agent 系统落地。
          </p>
        </div>
      </section>

      {/* 技能条 */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-10">
            技术栈熟练度
          </h2>

          <div className="space-y-6 max-w-3xl">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-sm md:text-base font-bold uppercase">
                    {skill.name}
                  </span>
                  <span className="font-mono text-xs md:text-sm font-bold">{skill.level}%</span>
                </div>
                <div className="h-8 border-4 border-black bg-white p-0.5 flex">
                  <div
                    className={`${skill.bg} h-full transition-all duration-700`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术分组 */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-10">
            工具与框架
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STACK.map((group) => (
              <div
                key={group.group}
                className="bg-white border-4 border-black rounded-none p-5 md:p-6 shadow-neo
                           transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <div className={`${group.bg} w-11 h-11 border-4 border-black flex items-center justify-center mb-5 -rotate-2`}>
                  <IconZap size={20} strokeWidth={3} className="text-black" />
                </div>
                <h3 className="font-black uppercase text-base md:text-lg mb-4">{group.group}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="font-mono text-xs md:text-sm flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-black shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学习路径 */}
      <section className="bg-neo-yellow border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-10">
            学习路径
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TIMELINE.map((stage, i) => (
              <div
                key={stage.phase}
                className="bg-white border-4 border-black rounded-none p-6 md:p-7 shadow-neo
                           transition-all duration-300 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`${stage.bg} border-[3px] border-black w-9 h-9 flex items-center justify-center font-black text-sm`}>
                    {i + 1}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                    {stage.phase}
                  </span>
                </div>

                <h3 className="font-black uppercase text-xl md:text-2xl mb-4 tracking-tight">
                  {stage.title}
                </h3>

                <ul className="space-y-2.5">
                  {stage.items.map((item) => (
                    <li key={item} className="font-mono text-xs md:text-sm flex items-start gap-2.5">
                      <span className="inline-block w-2 h-2 bg-black mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系 */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="bg-black border-4 border-black p-8 md:p-14 shadow-neo-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-neo-cyan border-4 border-white mb-6 -rotate-2">
                  <IconTarget size={26} strokeWidth={3} className="text-black" />
                </div>
                <h2 className="font-black uppercase text-3xl md:text-4xl text-white tracking-tight mb-5">
                  保持联系
                </h2>
                <p className="font-mono text-sm md:text-base text-neutral-400 leading-relaxed">
                  如果你对 AI 工程、Agent 系统或算法感兴趣，欢迎交流。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link href="/blog" className="nb-btn bg-neo-yellow text-black">
                  阅读博客
                  <IconArrowRight size={18} strokeWidth={3} />
                </Link>
                <Link href="/notes" className="nb-btn bg-neo-cyan text-black">
                  知识笔记
                  <IconLayers size={18} strokeWidth={3} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
