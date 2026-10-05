/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          red: '#ff6b6b',
          cyan: '#4ecdc4',
          yellow: '#ffe66d',
          mint: '#95e1d3',
          coral: '#f38181',
          black: '#1a1a1a',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
        sans: ['"Space Grotesk"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // 硬边阴影 —— 无模糊
        'neo-sm': '4px 4px 0px 0px #1a1a1a',
        'neo': '6px 6px 0px 0px #1a1a1a',
        'neo-lg': '8px 8px 0px 0px #1a1a1a',
        'neo-xl': '12px 12px 0px 0px #1a1a1a',
        // 彩色硬边阴影
        'neo-red': '6px 6px 0px 0px #ff6b6b',
        'neo-cyan': '6px 6px 0px 0px #4ecdc4',
        'neo-yellow': '6px 6px 0px 0px #ffe66d',
        'neo-mint': '6px 6px 0px 0px #95e1d3',
        // 白色硬边阴影（用于深色背景）
        'neo-white': '6px 6px 0px 0px #ffffff',
      },
      transitionTimingFunction: {
        'toy-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
