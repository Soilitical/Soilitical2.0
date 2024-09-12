import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faVideo
} from "@fortawesome/free-solid-svg-icons";

const BaseLayout = () => {
  return (
    <>
      <header
        id="header"
        className="py-4 px-6 flex justify-between items-center bg-black text-white sticky w-full z-30 top-0 h-auto"
      >
        {/* Logo */}
        <Link
          to="/"
          id="logo"
          className="inline-block w-16 h-16 bg-contain bg-no-repeat"
          style={{
            backgroundImage: "url('images/logo.png')"
          }}
        ></Link>

        {/* Navbar */}
        <nav className="flex justify-center flex-grow items-center text-center">
          <ul className="flex space-x-6 text-2xl font-bold">
            <li>
              <Link
                to="/"
                className="text-green-500 transition flex items-center"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-green-500 transition flex items-center"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> About
                Us
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-green-500 transition flex items-center"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Contact
                Us
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-green-500 transition flex items-center"
              >
                <FontAwesomeIcon icon={faVideo} className="mr-2" /> LIVE Station
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default BaseLayout;
