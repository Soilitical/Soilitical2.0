import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-white shadow-lg p-8 rounded-md max-w-md w-11/12 md:w-full">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Login</h2>
        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-md">
            <p>
              <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
            </p>
          </div>
        )}
        <form action="/login" method="post" className="space-y-4">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-500"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
            />
            <FontAwesomeIcon
              icon={faUser}
              className="absolute top-3 right-4 text-gray-500"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-500"
            >
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="form-input block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
            />
            <FontAwesomeIcon
              icon={faLock}
              className="absolute top-3 right-4 text-gray-500"
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="absolute top-3 right-10 text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-gray-600 mt-4">
          Don't have an account?
          <a href="#" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
        <p className="text-gray-600 mt-4">
          Quick Try?
          <a href="#" className="text-blue-500 hover:underline">
            Click Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
