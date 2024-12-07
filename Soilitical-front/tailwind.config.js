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
				90: "90%",
				0: "0%"
			},
			keyframes: {
				"grow-stem": {
					"0%": { height: "0" },
					"100%": { height: "4rem" }
				},
				"leaf-grow": {
					"0%": { transform: "scale(0) rotate(0deg)" },
					"100%": { transform: "scale(1) rotate(45deg)" }
				},
				"flower-bloom": {
					"0%": { transform: "scale(0)" },
					"50%": { transform: "scale(1.2)" },
					"100%": { transform: "scale(1)" }
				},
				"reveal-logo": {
					"0%": { opacity: "0", transform: "translateX(-100%)" },
					"100%": { opacity: "1", transform: "translateX(0)" }
				}
			},
			animation: {
				"grow-stem": "grow-stem 1.5s ease-out forwards",
				"leaf-grow": "leaf-grow 1.5s ease-out forwards",
				"flower-bloom": "flower-bloom 1.5s ease-out forwards",
				"reveal-logo": "reveal-logo 1.5s ease-out forwards"
			}
		}
	},
	plugins: []
};
