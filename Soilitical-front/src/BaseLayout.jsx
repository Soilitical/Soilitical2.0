// src/layouts/BaseLayout.jsx

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import FireflyBackground from "./components/FireflyBackground"; // <-- IMPORT HERE

const BaseLayout = () => {
	const location = useLocation();

	const getOverlayColor = () => {
		switch (location.pathname) {
			case "/signup":
				return "bg-gradient-to-br from-emerald-900/60 to-[#0F766E]/40";
			case "/login":
				return "bg-gradient-to-br from-[#D4AF37]/20 to-[#0F766E]/40";
			case "/":
				return "bg-gradient-to-br from-[#0F766E]/50 to-black/70";
			default:
				return "bg-gradient-to-br from-[#0F766E]/30 to-black/50";
		}
	};

	return (
		<div className="relative w-full min-h-screen overflow-hidden">
			{/* Fireflies behind everything */}
			<FireflyBackground />

			{/* Color overlay that changes by route */}

			{/* Navbar in front */}
			<Navbar />

			<main className="relative z-20 pb-20">
				<Outlet />
			</main>

			<footer className="absolute bottom-0 w-full bg-gradient-to-t from-[#0F766E] to-emerald-900 py-4 text-center z-20">
				<p className="text-[#D4AF37] font-medium text-sm">
					© 2024 Soilitical. Cultivating digital agriculture.
					<span className="block mt-1 text-emerald-200 text-xs">
						Sustainable solutions for modern farming
					</span>
				</p>
			</footer>
		</div>
	);
};

export default BaseLayout;
