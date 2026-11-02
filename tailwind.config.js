/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // theme-driven tokens (see index.css :root / .theme-*)
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          dim: "rgb(var(--accent) / <alpha-value>)",
          glow: "rgb(var(--accent) / <alpha-value>)",
        },
        signal: "rgb(var(--signal) / <alpha-value>)",
        // static dark inks kept as a fallback
        ink: {
          950: "#050506",
          900: "#0a0b0d",
          850: "#0e1013",
          800: "#14171b",
          700: "#1c2026",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        brand: ['"Poppins"', '"Space Grotesk"', "system-ui", "sans-serif"],
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "41%": { opacity: "1" },
          "42%": { opacity: "0.3" },
          "43%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.4" },
          "94%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flicker: "flicker 6s linear infinite",
        scan: "scan 6s linear infinite",
        blink: "blink 1s step-end infinite",
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
