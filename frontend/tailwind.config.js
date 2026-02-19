/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'western-purple': '#4F2683',
        'western-purple-light': '#6B3FA0',
        'western-purple-dark': '#3A1C62',
        'western-silver': '#807F83',
        'western-silver-light': '#A5A4A7',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
