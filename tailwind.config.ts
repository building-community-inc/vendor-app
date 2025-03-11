import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    letterSpacing: {
      superTight: "-0.8px",
    },
    extend: {
      transitionProperty: {
        'height': 'height',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#f3f3f3",
        primary: "#707070",
        "button-primary": "#E9E6E4",
        "button-border-color": "#707070",
        secondary: "#E7E7E7",
        "nav-bg": "#ffff",
        "nav-text": "#000000",
        "primary-admin-border": "#292929",
        "secondary-admin-border": "#707070",
        "title-color": "#C5B5A4",
        
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["var(--font-inter)"],
        segoe: ["Segoe", "sans-serif"],
        "darker-grotesque": ["var(--font-darker-grotesque)"],
      },
    },
  },
  plugins: [],
};
export default config;
