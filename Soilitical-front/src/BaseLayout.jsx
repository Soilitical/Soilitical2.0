import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Ensure Navbar is properly created and styled

const BaseLayout = () => {
	return (
		<div>
			{/* Navbar at the top */}
			<Navbar />
			<main>
				<Outlet />
			</main>
			<footer className="bg-black block text-white text-center bottom-0 py-4">
				© 2024 Soilitical. All rights reserved.
			</footer>
		</div>
	);
};

export default BaseLayout;
