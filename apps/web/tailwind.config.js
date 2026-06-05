/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        text: "#0D0F1C",
        muted: "#58607A"
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
