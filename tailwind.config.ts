import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        "surface-3": "var(--color-surface-3)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",
        "accent-foreground": "var(--color-accent-foreground)",
        muted: "var(--color-muted)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)"
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "3rem",
        "space-3xl": "4rem"
      },
      fontSize: {
        "display-2xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg": ["2.125rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-xl": ["1.75rem", { lineHeight: "1.25" }],
        "heading-lg": ["1.375rem", { lineHeight: "1.3" }],
        "heading-md": ["1.125rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6" }],
        "label-sm": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.12em" }]
      },
      boxShadow: {
        premium: "0 10px 30px rgba(14, 11, 20, 0.18)",
        "premium-lg": "0 24px 60px rgba(10, 8, 15, 0.28)",
        "premium-soft": "0 6px 18px rgba(12, 9, 17, 0.12)",
        "premium-inset": "inset 0 1px 0 rgba(255,255,255,0.04)"
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.2, 0.8, 0.2, 1)"
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(0.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "nav-sheet-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        }
      },
      animation: {
        "toast-in": "toast-in 240ms ease-premium forwards",
        "nav-sheet-in": "nav-sheet-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Playfair Display", "ui-serif", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
