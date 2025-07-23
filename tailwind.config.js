/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          dark: '#2c2f33',
          darker: '#23272a',
          light: '#99aab5',
          blurple: '#5865f2',
          green: '#57f287',
          yellow: '#fee75c',
          red: '#ed4245',
          white: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
