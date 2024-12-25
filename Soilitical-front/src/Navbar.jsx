import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faVideo,
	faBars,
	faTimes
} from "@fortawesome/free-solid-svg-icons";
import { useLoading } from "./context/LoadingContext";

const Navbar = () => {
	const { showLoader } = useLoading();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="bg-black text-white sticky top-0 w-full z-30">
			<div className="px-4 flex justify-between items-center">
				{/* Logo */}
				<Link
					to="/"
					className="inline-block w-20 h-20 bg-contain bg-no-repeat"
					style={{
						backgroundImage: "url('images/logo.png')"
					}}
				></Link>

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
						{/* <li>
							<Link
								to="#"
								className="hover:text-green-500 active:text-green-700 text-2xl  flex items-center transition"
								onClick={showLoader}
							>
								<FontAwesomeIcon icon={faVideo} className="mr-2" /> LIVE Station
							</Link>
						</li> */}
					</ul>
				</nav>

				{/* Hamburger Icon */}
				<button
					className="text-white text-3xl sm:hidden focus:outline-none"
					onClick={toggleMenu}
					aria-label="Toggle Menu"
				>
					<FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
				</button>
			</div>

			{/* Mobile Navbar */}
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
								className="text-green-500 flex items-center transition"
								onClick={() => {
									showLoader();
									toggleMenu();
								}}
							>
								<FontAwesomeIcon icon={faHome} className="mr-2" /> Home
							</Link>
						</li>
						<li>
							<Link
								to="#"
								className="hover:text-green-500 flex items-center transition"
								onClick={() => {
									showLoader();
									toggleMenu();
								}}
							>
								<FontAwesomeIcon icon={faVideo} className="mr-2" /> LIVE Station
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
