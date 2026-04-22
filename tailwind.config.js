/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#0f0f18',
        'bg-card': '#141420',
        'bg-card-hover': '#1a1a28',
        'accent-cyan': '#00d4ff',
        'accent-cyan-dim': '#0099cc',
        'accent-gold': '#ffd700',
        'accent-gold-light': '#ffed4a',
        'text-secondary-c': '#a0a8c0',
        'text-muted': '#606880',
        'border-c': '#2a2a40',
        'color-success': '#00ff88',
        'color-warning': '#ffaa00',
        'color-danger': '#ff4466',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
