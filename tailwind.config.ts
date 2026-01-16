import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism color palette
        primary: {
          DEFAULT: "#FFD93D",
          dark: "#F5C800",
        },
        success: "#6BCB77",
        danger: "#FF6B6B",
        accent: {
          blue: "#4D96FF",
          purple: "#9B5DE5",
        },
        background: "#FFFBEB",
        surface: "#FFFFFF",
        border: "#000000",
        text: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
        },
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-md": "4px 4px 0px 0px #000000",
        "brutal-lg": "8px 8px 0px 0px #000000",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-thai)", "var(--font-space-grotesk)", "sans-serif"],
        thai: ["var(--font-ibm-plex-thai)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
