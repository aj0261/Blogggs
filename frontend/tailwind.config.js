/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            iframe: {
              width: "100%",
              height: "auto",
              border: "none",
              borderRadius: "0.5rem",
              margin: "0 auto",
            },
            img: {
              borderRadius: "0.5rem",
              margin: "0 auto",
              display: "block",
              maxWidth: "100%",
              height: "auto",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
