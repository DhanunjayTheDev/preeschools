/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7A00",
        secondary: "#FFD93D",
        accent: "#5CD6FF",
      },
    },
  },
  plugins: [],
};
