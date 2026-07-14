import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0b0b16',
          secondary: '#13131f',
          card: '#1a1a2e',
          hover: '#22223b',
        },
        brand: {
          orange: '#f97316',
          orangeLight: '#fb923c',
          yellow: '#fbbf24',
          green: '#22c55e',
          greenDark: '#16a34a',
          red: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

export default config
