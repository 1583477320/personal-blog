import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { IconGithub, IconMail, IconZap, IconLayers } from './Icons'

type LayoutProps = {
  children: ReactNode
}

const NAV = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
  { href: '/notes', label: '笔记' },
  { href: '/about', label: '关于' },
]

export function Layout({ children }: LayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* 装饰性几何图形（固定定位，不参与布局） */}
      <div
        className="deco-square hidden lg:block"
        style={{ top: '12%', left: '2rem', width: 56, height: 56, background: '#ffe66d', transform: 'rotate(12deg)' }}
      />
      <div
        className="deco-circle hidden lg:block"
        style={{ top: '22%', right: '2.5rem', width: 44, height: 44, background: '#4ecdc4' }}
      />
      <div
        className="deco-square hidden lg:block"
        style={{ bottom: '18%', left: '2.5rem', width: 40, height: 40, background: '#f38181', transform: 'rotate(-8deg)' }}
      />

      {/* ── 导航栏 ── */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <nav className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-black uppercase text-base md:text-xl tracking-tight hover:text-neo-coral transition-colors duration-200 shrink-0"
          >
            小朱的数字花园
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {NAV.map((item) => {
              const active =
                item.href === '/' ? router.pathname === '/' : router.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'font-mono text-xs md:text-sm font-bold uppercase px-2.5 py-1.5 border-[3px] border-black',
                    'rounded-none transition-all duration-300',
                    'hover:-translate-y-1 hover:shadow-neo-sm',
                    'active:translate-y-0 active:shadow-none',
                    active ? 'bg-neo-yellow shadow-neo-sm' : 'bg-white',
                  ].join(' ')}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      {/* 滚动跑马灯条 —— 经典野兽派元素 */}
      <div className="bg-black text-white border-b-4 border-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-2 flex items-center gap-6 font-mono text-[11px] md:text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2 shrink-0">
            <span className="inline-block w-2.5 h-2.5 bg-neo-cyan border-2 border-white" />
            AI ENGINEER
          </span>
          <span className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="inline-block w-2.5 h-2.5 bg-neo-red border-2 border-white" />
            TECH NOTES
          </span>
          <span className="hidden md:flex items-center gap-2 shrink-0">
            <span className="inline-block w-2.5 h-2.5 bg-neo-yellow border-2 border-white" />
            LEETCODE
          </span>
          <span className="ml-auto text-neo-mint shrink-0">STATUS : ONLINE</span>
        </div>
      </div>

      {/* ── 主内容 ── */}
      <main className="relative z-10">{children}</main>

      {/* ── 页脚 ── */}
      <footer className="bg-black text-white border-t-4 border-black mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neo-yellow border-4 border-white flex items-center justify-center">
                  <IconLayers size={20} strokeWidth={3} className="text-black" />
                </div>
                <span className="font-black uppercase text-lg md:text-xl text-white">
                  小朱的数字花园
                </span>
              </div>
              <p className="font-mono text-xs md:text-sm text-neutral-400 max-w-xs leading-relaxed">
                记录技术探索之路。Transformer / Agent 工程 / 算法 / 系统。
              </p>
            </div>

            <div>
              <h4 className="font-black uppercase text-base md:text-lg text-neo-cyan mb-4">
                快速导航
              </h4>
              <ul className="font-mono text-xs md:text-sm space-y-2">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white hover:text-neo-yellow transition-colors duration-200 inline-flex items-center gap-2"
                    >
                      <span className="inline-block w-2 h-2 bg-neo-red" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase text-base md:text-lg text-neo-yellow mb-4">
                联系方式
              </h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-11 h-11 bg-white border-4 border-white rounded-none flex items-center justify-center text-black
                             hover:bg-neo-cyan transition-all duration-300 hover:-translate-y-1
                             active:translate-y-0"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <IconGithub size={20} strokeWidth={2.5} />
                </a>
                <a
                  href="mailto:hello@example.com"
                  aria-label="Email"
                  className="w-11 h-11 bg-white border-4 border-white rounded-none flex items-center justify-center text-black
                             hover:bg-neo-yellow transition-all duration-300 hover:-translate-y-1
                             active:translate-y-0"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <IconMail size={20} strokeWidth={2.5} />
                </a>
                <a
                  href="/blog"
                  aria-label="Blog"
                  className="w-11 h-11 bg-white border-4 border-white rounded-none flex items-center justify-center text-black
                             hover:bg-neo-red transition-all duration-300 hover:-translate-y-1
                             active:translate-y-0"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <IconZap size={20} strokeWidth={2.5} />
                </a>
              </div>
              <p className="font-mono text-xs text-neutral-500 mt-6">
                © 2026 小朱的数字花园
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
