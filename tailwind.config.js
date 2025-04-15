const plugin = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9500',
          50: '#FFF7E6',
          100: '#FFE8B8',
          200: '#FFD88A',
          300: '#FFC85C',
          400: '#FFB82E',
          500: '#FF9500',
          600: '#CC7700',
          700: '#995A00',
          800: '#663C00',
          900: '#331E00',
        },
        accent: {
          DEFAULT: '#FF3B30',
          50: '#FFEEEE',
          100: '#FFCCCB',
          200: '#FFA9A7',
          300: '#FF8784',
          400: '#FF6460',
          500: '#FF3B30',
          600: '#E01A10',
          700: '#A8130C',
          800: '#700D08',
          900: '#380704',
        },
        secondary: {
          DEFAULT: '#9B9B9B',
          light: '#E0E0E0',
          dark: '#4A4A4A',
        },
      },
      fontFamily: {
        'dbhelvetica': ['DB Helvethaica X', 'sans-serif'],
        'dbhelvetica-med': ['DB Helvethaica X Med', 'sans-serif'],
        'dbhelvetica-bd': ['DB Helvethaica X Bd', 'sans-serif'],
      },
      plugins: [plugin],
    }
  }
}