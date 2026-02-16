import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f4efe9",
        dune: "#e6dccf",
        sage: "#7fa08a",
        coral: "#e88b6f",
        ink: "#1b1b1d",
        cloud: "#f9f7f4",
        ember: "#d45a40",
        tide: "#2b5965",
        glow: "#f7d9c7"
      },
      boxShadow: {
        card: "0 24px 60px -30px rgba(27, 27, 29, 0.35)",
        glow: "0 0 60px rgba(232, 139, 111, 0.35)"
      },
      borderRadius: {
        "2xl": "1.75rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.8s ease both",
        shimmer: "shimmer 2.5s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
