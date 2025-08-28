/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Lora', 'serif'],
    },
    extend: {
      colors: {
        background: {
          page: '#FDFCF9',
          card: '#FFFFFF',
          alt: '#F7F5F2'
        },
        text: {
          primary: '#343434',
          secondary: '#6B6B6B',
          tertiary: '#9E9E9E',
          darkbg: '#FFFFFF',
        },
        brand: {
          primary: '#4A694E',
          secondary: '#8B6F4E',
          green: '#4A694E',
          success: '#38A169',
          orange: '#DD6B20',
          gold: '#FFD700',
          danger: '#E53E3E',
        },
        subject: {
          physics: '#EAEFE6',
          chemistry: '#F5F0E9',
          biology: '#E6EFEE',
        },
        border: {
          DEFAULT: '#EDEAE6',
        },
      },
    },
  },
  plugins: [],
}