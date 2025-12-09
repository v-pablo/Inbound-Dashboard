/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        shuttlers: { green: '#03C04A' },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}