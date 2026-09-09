/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
        },
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        display: ['Instrument Serif', 'serif'],
        mono: ['monospace'],
      },
      borderRadius: {
        'btn': 'var(--radius-button)',
      }
    },
  },
  plugins: [],
}
