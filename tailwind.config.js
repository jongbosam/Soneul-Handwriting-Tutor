/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB347', 
        secondary: '#FFD1DC', 
        accent: '#77DD77', 
        paper: '#FFFDF5', 
        ink: '#2C2C2C',
      },
      fontFamily: {
        sans: ['"Jua"', '"Gaegu"', 'sans-serif'],
        hand: ['"Gaegu"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    }
  },
  plugins: [],
}