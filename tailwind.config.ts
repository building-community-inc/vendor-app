import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#191919",
        primary: "#707070",
        secondary: "#E7E7E7",
        "nav-bg": "#ffff",
        "nav-text": "#000000",
        "primary-admin-border": "#292929",
        "secondary-admin-border": "#707070",
        
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        segoe: ["Segoe", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
