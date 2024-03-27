module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {},
    fontFamily: {
      body: ['YuGothic', 'Yu Gothic'],
      reitam: ['Reitam', 'sans-serif'],
      bebas: ['BebasKai', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      spacing: {
        '20px': '20px',
      },
    },
  },
  plugins: [],
}
