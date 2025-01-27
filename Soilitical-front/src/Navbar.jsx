import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faBars,
	faTimes,
	faCircleHalfStroke // More modern icon
} from "@fortawesome/free-solid-svg-icons";
import { useLoading } from "./context/LoadingContext";
import { useTheme } from "./context/ThemeContext";

const Navbar = () => {
	const { showLoader } = useLoading();
	const { isDarkMode, toggleTheme } = useTheme();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Modern toggle button component
	const ThemeToggle = () => (
		<button
			onClick={toggleTheme}
			className="group p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
			aria-label="Toggle theme"
		>
			<FontAwesomeIcon
				icon={faCircleHalfStroke}
				className="text-xl text-green-500 
                 group-hover:text-green-400 
                 transition-all duration-300
                 hover:rotate-180"
			/>
		</button>
	);

	return (
		<header className="bg-black text-white sticky top-0 w-full z-30">
			<div className="px-4 flex justify-between items-center">
				{/* Logo */}
				<Link
					to="/"
					className="inline-block w-20 h-20 bg-contain bg-no-repeat"
					style={{ backgroundImage: "url('images/logo.png')" }}
				/>

				{/* Desktop Navbar */}
				<nav className="hidden sm:flex justify-center flex-grow space-x-6 text-lg font-bold">
					<ul className="flex items-center space-x-6">
						<li>
							<Link
								to="/"
								className="text-green-500 hover:text-green-700 active:text-green-900 text-2xl flex items-center transition"
								onClick={showLoader}
							>
								<FontAwesomeIcon icon={faHome} className="mr-2" /> Home
							</Link>
						</li>
						<li>
							<Link
								to="/quicktry"
								className="text-white hover:text-green-500 active:text-green-900 text-2xl flex items-center transition"
								onClick={showLoader}
							>
								Quick Try
							</Link>
						</li>
						<li>
							<ThemeToggle />
						</li>
					</ul>
				</nav>

				{/* Mobile Menu Toggle */}
				<div className="ml-12 sm:hidden">
					<ThemeToggle />
				</div>

				<button
					className="text-white text-3xl sm:hidden focus:outline-none"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Toggle Menu"
				>
					<FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
				</button>
			</div>

			{/* Mobile Menu */}
			<div
				className={`sm:hidden bg-black text-white w-full overflow-hidden transition-all duration-500 ${
					isMenuOpen ? "max-h-40" : "max-h-0"
				}`}
			>
				<nav>
					<ul className="flex flex-col space-y-3 p-4 text-lg font-bold">
						<li>
							<Link
								to="/"
								className="text-green-500 hover:text-green-700 active:text-green-900 flex items-center transition"
								onClick={showLoader}
							>
								<FontAwesomeIcon icon={faHome} className="mr-2" /> Home
							</Link>
						</li>
						<li>
							<Link
								to="/quicktry"
								className="text-white hover:text-green-500 active:text-green-900 flex items-center transition"
								onClick={showLoader}
							>
								Quick Try
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
