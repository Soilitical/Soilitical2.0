// src/context/ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		// Read from localStorage on initial load
		const savedTheme =
			typeof window !== "undefined" ? localStorage.getItem("theme") : null;
		return savedTheme ? savedTheme === "dark" : true;
	});

	useEffect(() => {
		// Save to localStorage when theme changes
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");
		document.body.classList.toggle("dark-mode", isDarkMode);
		document.body.classList.toggle("light-mode", !isDarkMode);
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
