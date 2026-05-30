import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#05030d",
        nebula: "#130f2e",
        starlight: "#d8e9ff",
        eclipse: "#8b5cf6",
        solar: "#f59e0b",
        plasma: "#22d3ee"
      },
      boxShadow: {
        glow: "0 0 45px rgba(139, 92, 246, 0.35)"
      },
      backgroundImage: {
        "cosmic-grid": "linear-gradient(rgba(139,92,246,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.12) 1px, transparent 1px)"
      },
      animation: {
        drift: "drift 18s ease-in-out infinite alternate",
        pulseGlow: "pulseGlow 4s ease-in-out infinite"
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate3d(-2%, -1%, 0) scale(1)" },
          "100%": { transform: "translate3d(2%, 1%, 0) scale(1.04)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
