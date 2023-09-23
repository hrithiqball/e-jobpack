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
        black: "#333",
        white: "#ffffff",
        silver: "#c8ccce",
        "emerald-green-dark": "#00635b",
        "emerald-green-light": "#00a19c",
        "deep-gray": "#3d3935",
      },
    },
  },
  plugins: [],
};
export default config;
