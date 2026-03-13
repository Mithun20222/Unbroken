/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          0: '#0a0a0f',
          1: '#111118',
          2: '#17171f',
          3: '#1e1e28',
          4: '#252532',
        },
        brand: {
          DEFAULT: '#f97316',
          dim: '#c2580e',
          glow: 'rgba(249,115,22,0.15)',
        },
        accent: '#a78bfa',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(249,115,22,0.25)',
      },
    },
  },
  plugins: [],
};
