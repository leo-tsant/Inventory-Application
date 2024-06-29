/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pokemon: ['"Press Start 2P"', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(190deg, #52118b 21%, #203298 76%)'
      }
    },
  },
  plugins: [],
}


