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
          50: "#fff8f1",
          100: "#ffecd9",
          200: "#ffd5ae",
          300: "#ffb277",
          400: "#ff8a3d",
          500: "#f96a12",
          600: "#e05008",
          700: "#b93c09",
          800: "#93300f",
          900: "#76290f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(120, 60, 0, 0.12)",
        card: "0 2px 12px -4px rgba(120, 60, 0, 0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
