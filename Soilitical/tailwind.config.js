module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        md: "0 0 10px rgba(0, 255, 255, 0.5)"
      },
      fontFamily: {
        drukTextHeavy: ["DrukTextHeavy", "sans-serif"],
        drukTextSuper: ["DrukTextSuper", "sans-serif"],
        drukTextBoldItalic: ["DrukTextBoldItalic", "sans-serif"],
        drukTextBold: ["DrukTextBold", "sans-serif"]
      },
      grayscale: {
        90: "90%"
      },
      grayscale: {
        0: "0%"
      }
    }
  },
  plugins: []
};
