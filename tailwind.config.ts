import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7F7F5",
        surface: "#FFFFFF",
        ink: "#111111",
        muted: "#666666",
        line: "#E8E8E8",
        accent: "#4A7DFF",
        "accent-2": "#6C95FF",
        "accent-hover": "#5B88FF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        container: "1280px",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "cloud-drift": {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(3%,-2%,0) scale(1.08)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        "cloud-drift-slow": {
          "0%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-4%,2%,0) scale(1)" },
          "100%": { transform: "translate3d(0,0,0) scale(1.05)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-5%)" },
          "30%": { transform: "translate(3%,-8%)" },
          "50%": { transform: "translate(-4%,6%)" },
          "70%": { transform: "translate(6%,4%)" },
          "90%": { transform: "translate(-2%,-3%)" },
        },
      },
      animation: {
        "cloud-drift": "cloud-drift 26s ease-in-out infinite",
        "cloud-drift-slow": "cloud-drift-slow 34s ease-in-out infinite",
        grain: "grain 0.6s steps(2) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
