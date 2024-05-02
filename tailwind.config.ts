import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#a87f7f',
        secondary: '#fffae1',
      },
    },
  },
  plugins: [],
} satisfies Config
