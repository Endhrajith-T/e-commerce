import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F7F0E0",
        ink: "#18100A",
        gold: "#C8A96A",
        muted: "#6B5E4A",
        border: "#E5D9C5",
        accent: "#8B5E3C"
      },
      fontFamily: {
        serif: ["Cormorant", "serif"],
        body: ["Jost", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;