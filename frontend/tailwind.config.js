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
        'western-purple-deeper': '#2D1650',
        'western-purple-soft': '#8B6DB0',
        'western-silver': '#807F83',
        'western-silver-light': '#A5A4A7',
        'western-cream': '#F5F0EB',
        'western-warm': '#E8DDD4',
        'western-gold': '#C4943A',
        'western-gold-light': '#D4A94E',
        'western-gold-dark': '#8B6914',
        'western-gold-deeper': '#5C4510',
        'western-gold-muted': '#A07D2E',
        'western-gold-bg': '#3D3320',
        'western-gold-surface': '#4A3E28',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
