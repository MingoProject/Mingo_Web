/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          100: "#768D85",
        },
        dark: {
          100: "#CFBFAD",
          200: "#252525",
          300: "#515E5A",
          400: "#2D2F2F",
          500: "#1E2021",
        },
        light: {
          100: "#1E2021",
          200: "#FFFFFF",
          300: "#BAC6C2",
          400: "#F1F4F3",
          500: "#FAFAFA",
        },
        border: {
          100: "#F5F5F5",
        },
      },

      boxShadow: {
        subtle: "0px 4px 15px rgba(0, 0, 0, 0.03)",
      },

      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
