/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Architects Daughter"', 'cursive'],
      serif: ['"Architects Daughter"', 'cursive'],
    },
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        background: {
          page: '#f7f5f2', // Textured paper background
          card: '#ffffff',
          alt: '#eaddc7'
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
          physics: '#e0f2fe', // Light Blue
          chemistry: '#ffedd5', // Light Orange
          biology: '#dcfce7', // Light Green
        },
        border: {
          DEFAULT: '#EDEAE6',
        },
      },
    },
  },
  plugins: [],
}