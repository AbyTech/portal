/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-active': '#00BFFF', // Neon Blue
        'sidebar-inactive': '#2A2A2A',
        'background': '#000000',
        'card-dark': '#1F1F1F',
        'card-darker': '#1A1A1A',
        'transaction-green': '#39FF14', // Neon Green
        'transaction-red': '#FF00FF',   // Neon Pink
        'text-primary': '#FFFFFF',
        'text-secondary': '#E0E0E0',   // Light Grey
        'neon-blue': '#00BFFF',
        'neon-pink': '#FF00FF',
      },
      width: {
        'sidebar': '310px',
      },
      margin: {
        'sidebar': '310px',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00BFFF 0%, #FF00FF 100%)',
      }
    },
  },
  plugins: [],
}