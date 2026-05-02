/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./food-store/src/**/*.{js,ts,jsx,tsx}", // Agregada la carpeta 'food-store'
    "./src/**/*.{js,ts,jsx,tsx}",            // Por si acaso
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}