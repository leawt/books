/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFCFA',
        text: {
          primary: '#2B2B2B',
          secondary: '#6B6B6B',
        },
        accent: {
          purple: '#8B7BA8',
          'purple-hover': '#6B5B95',
        },
      },
      fontFamily: {
        sans: ['Karla', 'sans-serif'],
        serif: ['Epilogue', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(139, 123, 168, 0.15)',
        'soft-lg': '0 4px 16px rgba(139, 123, 168, 0.2)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
