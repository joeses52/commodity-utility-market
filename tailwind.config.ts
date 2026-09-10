import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0c0b0a",
        cream: "#f4efe6",
        mist: "#9a9488",
        gold: {
          bright: "#f0c14b",
          deep: "#c9922a",
        },
        silver: "#b8c0cc",
        metal: {
          card: "#161412",
          surface: "#1e1b18",
          border: "#2e2a25",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-gold": "0 0 24px rgba(240, 193, 75, 0.25)",
        "glow-soft": "0 8px 32px rgba(0, 0, 0, 0.35)",
        card: "0 4px 16px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(240,193,75,0.08), transparent 55%), radial-gradient(ellipse at bottom right, rgba(184,192,204,0.06), transparent 45%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
