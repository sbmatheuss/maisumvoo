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
        ink: {
          950: "#080808",
          900: "#111111",
          800: "#1A1A1A",
          700: "#252525",
          600: "#333333",
          500: "#555555",
          400: "#8A8A8A",
          300: "#ABABAB",
          200: "#D0D0D0",
          100: "#EBEBEB",
          50: "#F5F5F5",
        },
        gold: {
          DEFAULT: "#D9B66B",
          light: "#E5C882",
          dark: "#B8924A",
        },
        navy: {
          DEFAULT: "#0A1F33",
          700: "#0D2640",
          600: "#163352",
          400: "#3D6680",
          200: "#8DAABF",
          100: "#C4D5E0",
          50: "#EBF0F5",
        },
        parchment: {
          DEFAULT: "#FAF9F6",
          dark: "#F0EDE6",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        full: "2px",
      },
      letterSpacing: {
        widest: "0.2em",
      },
      gridTemplateColumns: {
        editorial: "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;
