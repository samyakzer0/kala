/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
        pacifico: ['var(--font-pacifico)'],
      },
      colors: {
        // Custom color palette
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#596a7d', // Primary color
          600: '#495d70',
          700: '#3a4a5a',
          800: '#2d3748',
          900: '#1a202c',
        },
        secondary: {
          50: '#fefaf5',
          100: '#fdf4e8',
          200: '#fbe5c5',
          300: '#f7d09e',
          400: '#e6af5a', // Warm gold/bronze for buttons and accents
          500: '#d4942e',
          600: '#b87d1f',
          700: '#9a6418',
          800: '#7d4f16',
          900: '#643f14',
        },
        ivory: {
          50: '#fffffe',
          100: '#fffef7',
          200: '#fffcf0',
          300: '#fffae9',
          400: '#fff8e1', // Ivory white for text
          500: '#fff6da',
          600: '#e6dcc4',
          700: '#ccc2ae',
          800: '#b3a899',
          900: '#998e83',
        }
      },
    },
  },
  plugins: [],
}

