// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4A694E', // Deep Forest Green (Adjusted)
        'brand-secondary': '#8B6F4E', // Muted Gold/Brown (Adjusted)
        'brand-accent': '#DD6B20', // Burnt Orange (From HTML)
        'brand-success': '#38A169', // Success Green (From HTML)
        'background-primary': '#FFFFFF', // White
        'background-secondary': '#F7FAFC', // Very Light Gray
        'background-alt': '#EDF2F7', // Light Gray
        'background-page': '#f7f5f2', // beige background from html
        'text-primary': '#343434', // Dark Gray (From HTML)
        'text-secondary': '#6B6B6B', // Medium Gray (From HTML)
        'text-tertiary': '#9E9E9E', // Light Gray (From HTML)
        'border': '#E2E8F0', // Border color
        // Add more colors as needed based on your design
      },
      fontFamily: {
        // Use Tailwind's default sans-serif stack by not specifying Poppins here
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        // Keep Lora if you use font-serif anywhere
        serif: ['Lora', 'serif'],
      },
      boxShadow: {
        'card': '4px 4px 0px #343434', // Custom shadow matching .card style
        'button': '2px 2px 0px', // Base shadow offset for buttons
      },
      keyframes: {
         shake: {
           '0%, 100%': { transform: 'translateX(0)' },
           '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
           '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
         },
         // Add other keyframes if needed
       },
       animation: {
         shake: 'shake 0.5s ease-in-out',
         // Add other animations if needed
       },
    },
  },
  plugins: [
     require('@tailwindcss/typography'), // For prose styling
  ],
}