import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faLock,
	faEye,
	faEyeSlash,
	faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(""); // Clear any previous error

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || "Login failed.");
				return;
			}

			const data = await response.json();
			// Assuming the API sends back "accessToken" and "refreshToken"
			localStorage.setItem("accessToken", data.accessToken);
			localStorage.setItem("refreshToken", data.refreshToken);

			// Navigate to dashboard after successful login
			navigate("/dashboard");
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
		}
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
				<form onSubmit={handleLogin} className="space-y-4">
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
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="form-input block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
							required
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
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="form-input block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
							required
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
					Don't have an account?{" "}
					<Link to="/signup" className="text-blue-500 hover:underline">
						Sign Up
					</Link>
				</p>
				<p className="text-gray-600 mt-4">
					Quick Try?{" "}
					<Link to="/quicktry" className="text-blue-500 hover:underline">
						Click Here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
