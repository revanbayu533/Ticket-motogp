/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        motogp: {
          red: '#E10600',
          darkred: '#9B0400',
          black: '#121212',
          card: '#1A1A1A',
          border: '#2A2A2A',
          gray: '#8E8E93',
          lightgray: '#F2F2F7',
          neon: '#00F0FF',
          gold: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        racing: ['"Racing Sans One"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
