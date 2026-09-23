/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#22a652',
          'primary-dark': '#1b8e45',
          'primary-light': '#ecf7e6',
          navy: '#123F5B',
          'navy-dark': '#0D3549',
          muted: '#61717A',
          canvas: '#F9F8F5',
        },
        bg: '#F8FAF7',
        surface: '#ffffff',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['"Manrope"', '"Figtree"', '"Inter"', 'system-ui', 'sans-serif'],
        heading: ['"Manrope"', '"Figtree"', 'sans-serif'],
        display: ['"Manrope"', '"Geist"', 'sans-serif'],
        mono: ['"Manrope"', 'system-ui', 'sans-serif'],
        script: ['"Kalam"', '"Caveat"', 'cursive'],
        handwriting: ['"Caveat"', '"Kalam"', 'cursive'],
      },
    },
  },
  plugins: [],
}
