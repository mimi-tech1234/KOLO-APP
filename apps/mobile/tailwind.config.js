/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B1F5E",
        accent: "#D4A017",
        success: "#2E7D32",
        danger: "#C62828",
        warm: "#C1440E",
        background: "#F8F9FF",
        surface: "#FFFFFF",
        text: "#0D0F1C"
      }
    }
  },
  plugins: []
};
