/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Lato'],
      },
      colors: {
        "primary": "#002282",
        "SurfacePrimary": "#23335F",
        "textPrimary": "#FFFFFF",
        "textSecondary": "#191820",
        "stokePrimary": "#E8505B",
        "stokeSecondary": "#E8505B",
        "unActive": "#C1C7D0",
        "success": "#02BC7D",
        "error": "#D30000",
      },
    },
  },
  plugins: [],
}