/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#163828',
          'forest-dark': '#0f281c',
          'forest-light': '#edf5ef',
          green: '#22a652',
          'green-dark': '#1b8e45',
          'green-light': '#ecf7e6',
          action: '#22a652',
          'action-dark': '#1b8e45',
          terracotta: '#c98a2c',
          'terracotta-dark': '#b37822',
          blue: '#0e3a53',
          'blue-dark': '#072435',
          'blue-marine': '#041f30',
          teal: '#0a6375',
          navy: '#123F5B',
          'navy-dark': '#0D3549',
          lake: '#1F6685',
          'lake-light': '#E8F3F7',
          charcoal: '#183247',
          ink: '#232826',
          muted: '#61717A',
          'stone-border': '#E7E4DC',
          canvas: '#F9F8F5',
        },
        bg: '#F8FAF7',
        surface: '#ffffff',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        script: ['"Kalam"', '"Caveat"', 'cursive'],
        handwriting: ['"Caveat"', '"Kalam"', 'cursive'],
      },
    },
  },
  plugins: [],
}
