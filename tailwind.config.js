/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          950: '#1e0a3c',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(168, 85, 247, 0.4)',
        'glow-md': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-lg': '0 0 30px rgba(168, 85, 247, 0.6)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
