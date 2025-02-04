/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#F36B24",
        secondary: "#0F416F",
        headingColor: "#9095A1",
        paragraphColor: "#646982",
        white: "#FFFFFF",
        black: "#000000",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        md: "22px",
        lg: "28px",
        xl: "50px",
      },
    },
  },
  plugins: [],
};
