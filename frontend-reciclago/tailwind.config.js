/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#70b832',
          'green-dark': '#559424',
          'green-light': '#ecf7e6',
          blue: '#0e3a53',
          'blue-dark': '#072435',
          'blue-marine': '#041f30',
          teal: '#0a6375',
          navy: '#123F5B',
          'navy-dark': '#0D3549',
          lake: '#1F6685',
          'lake-light': '#E8F3F7',
          charcoal: '#183247',
          muted: '#61717A'
        },
        bg: '#f7faf8',
        surface: '#ffffff',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        script: ['"Caveat"', '"Kalam"', 'cursive'],
        handwriting: ['"Caveat"', '"Kalam"', 'cursive'],
      },
    },
  },
  plugins: [],
}
