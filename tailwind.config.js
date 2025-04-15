/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'hex-dark': '#004C5F',
        'hex-light': '#00A3C6',
        'cube-dark': '#8A1B3F',
        'cube-light': '#C72745',
        'gray-slogan': '#444444',
      },
    },
  },
  plugins: [],
} 