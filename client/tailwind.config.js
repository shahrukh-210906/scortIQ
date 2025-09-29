// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
      },
      colors: {
        background: {
          page: '#f8f9fa',    // Light gray background
          card: '#ffffff',     // White cards
          alt: '#f1f3f5'       // Slightly darker gray for alternate backgrounds
        },
        text: {
          primary: '#212529',   // Darker black for text
          secondary: '#6c757d', // Muted gray for secondary text
          tertiary: '#adb5bd',  // Lighter gray
        },
        brand: {
          primary: '#007bff',   // A modern blue for primary actions
          secondary: '#6c757d', // Gray for secondary actions
          success: '#28a745',   // Green for success
          danger: '#dc3545',    // Red for danger/warnings
        },
        border: {
          DEFAULT: '#dee2e6', // Standard border color
        },
      },
    },
  },
  plugins: [],
}