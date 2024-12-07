import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar"; // Ensure Navbar is properly created and styled

const BaseLayout = () => {
	const location = useLocation();

	// Determine the overlay color based on the current route
	const getOverlayColor = () => {
		switch (location.pathname) {
			case "/signup":
				return "bg-teal-900/50"; // Color for Signup page
			case "/login":
				return "bg-gray-900/50"; // Color for Login page
			case "/":
				return "bg-blue-500/50"; // Color for Home page
			// Add more cases for other routes as needed
			default:
				return "bg-transparent"; // Default color
		}
	};

	return (
		<div className="relative w-full h-screen bg-background bg-cover bg-center">
			<div className={`absolute inset-0 ${getOverlayColor()}`}></div>
			<Navbar />
			<main className="relative z-10">
				<Outlet />
			</main>
			<footer className="bg-black block text-white text-center bottom-0 py-4">
				© 2024 Soilitical. All rights reserved.
			</footer>
		</div>
	);
};

export default BaseLayout;
