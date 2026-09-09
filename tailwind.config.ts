import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F766F",
          50: "#F4F7F6",
          100: "#E3ECE9",
          200: "#C7DAD5",
          300: "#A3C3BC",
          400: "#75A49B",
          500: "#4F766F",
          600: "#3F5E58",
          700: "#344D48",
          800: "#2B3E3A",
          900: "#243431",
          dark: "#2A3F3B",
          hover: "#43655F",
        },
        canvas: {
          DEFAULT: "#F2F0EA",
          subtle: "#EAE7DF",
          border: "#DCD8CC",
          card: "#FCFBF9",
          muted: "#8A877E",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 8px 24px -4px rgba(79, 118, 111, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "card-active": "0 0 0 2px #4F766F, 0 4px 12px -2px rgba(79, 118, 111, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
