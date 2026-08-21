/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          300: "#C4B5FD",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
        },
        secondary: {
          100: "#FCE7F3",
          300: "#F9A8D4",
          500: "#EC4899",
          600: "#DB2777",
        },
        accent: {
          300: "#FDBA74",
          500: "#FB923C",
          600: "#EA580C",
        },
        deep: "#312E81",
        surface: "#FCFAFF",
        ink: "#1E1B2E",
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "zyqora-mesh":
          "radial-gradient(at 10% 10%, rgba(124,58,237,0.15) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(236,72,153,0.18) 0px, transparent 50%), radial-gradient(at 10% 90%, rgba(251,146,60,0.20) 0px, transparent 50%), radial-gradient(at 90% 90%, rgba(192,132,252,0.12) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(254,215,170,0.15) 0px, transparent 50%)",
        "zyqora-gradient": "linear-gradient(90deg, #7C3AED 0%, #EC4899 60%, #FB923C 100%)",
        "zyqora-gradient-vertical": "linear-gradient(180deg, #7C3AED 0%, #EC4899 100%)",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(124, 58, 237, 0.08)",
        card: "0 4px 20px rgba(30, 27, 46, 0.06)",
        "card-hover": "0 12px 32px rgba(124, 58, 237, 0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};