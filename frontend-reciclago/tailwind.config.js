/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bosque: {
          950: '#0E1A14',
          900: '#14261C',
          800: '#1A3324',
          700: '#1F3D2C',
        },
        pizarra: {
          700: '#334149',
          600: '#4A5A63',
          400: '#748791',
          200: '#C8D1D5',
        },
        niebla: {
          50: '#F5F6F3',
          100: '#EDEFEA',
          200: '#DFE2DA',
        },
        madera: {
          600: '#744F35',
          500: '#8B6142',
          400: '#A67855',
          100: '#F5EBE1',
        },
        lago: {
          600: '#4F737C',
          400: '#7FA5AE',
          200: '#BED1D6',
        },
        brand: {
          primary: '#1F3D2C',
          'primary-dark': '#14261C',
          'primary-light': '#EDEFEA',
          navy: '#0E1A14',
          'navy-dark': '#09120D',
          muted: '#4A5A63',
          canvas: '#EDEFEA',
        },
        bg: '#EDEFEA',
        surface: '#F5F6F3',
        border: '#DFE2DA',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        script: ['"Kalam"', '"Caveat"', 'cursive'],
        handwriting: ['"Caveat"', '"Kalam"', 'cursive'],
      },
    },
  },
  plugins: [],
}
