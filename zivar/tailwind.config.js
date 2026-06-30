/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zivar: {
          cream: '#F5F0EB',
          beige: '#EDE8E0',
          gold: '#B8860B',
          'gold-light': '#D4A843',
          'gold-dark': '#8B6914',
          stone: '#8C8680',
          'stone-dark': '#3D3A37',
          'stone-light': '#A8A29E',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
