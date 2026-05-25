/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        paper: "#f7f8f4",
        moss: "#386641",
        coral: "#d45d4c",
        amber: "#d99b38"
      },
      boxShadow: {
        soft: "0 12px 34px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};
