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

const SignUp = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: ""
	});
	const [passwordVisible, setPasswordVisible] = useState({
		password: false,
		confirmPassword: false
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const togglePasswordVisibility = (field) => {
		setPasswordVisible((prevState) => ({
			...prevState,
			[field]: !prevState[field]
		}));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value
		}));
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		setError(""); // Clear any previous error

		const { username, password, confirmPassword } = formData;
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			const response = await fetch("/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || "Sign-up failed.");
				return;
			}

			// Redirect to login or dashboard after successful sign-up
			navigate("/login");
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-teal-900">
			<div className="bg-white shadow-lg p-8 rounded-md max-w-md w-11/12 md:w-full">
				<h2 className="text-3xl font-semibold mb-6 text-gray-800">Sign Up</h2>
				{error && (
					<div className="bg-red-500 text-white p-3 mb-4 rounded-md">
						<p>
							<FontAwesomeIcon icon={faExclamationTriangle} /> {error}
						</p>
					</div>
				)}
				<form onSubmit={handleSignUp} className="space-y-4">
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
							value={formData.username}
							onChange={handleInputChange}
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
							type={passwordVisible.password ? "text" : "password"}
							id="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							className="form-input block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
							required
						/>
						<FontAwesomeIcon
							icon={faLock}
							className="absolute top-3 right-4 text-gray-500"
						/>
						<FontAwesomeIcon
							icon={passwordVisible.password ? faEyeSlash : faEye}
							className="absolute top-3 right-10 text-gray-500 cursor-pointer"
							onClick={() => togglePasswordVisibility("password")}
						/>
					</div>
					<div className="relative">
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-500"
						>
							Confirm Password
						</label>
						<input
							type={passwordVisible.confirmPassword ? "text" : "password"}
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleInputChange}
							className="form-input block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
							required
						/>
						<FontAwesomeIcon
							icon={faLock}
							className="absolute top-3 right-4 text-gray-500"
						/>
						<FontAwesomeIcon
							icon={passwordVisible.confirmPassword ? faEyeSlash : faEye}
							className="absolute top-3 right-10 text-gray-500 cursor-pointer"
							onClick={() => togglePasswordVisibility("confirmPassword")}
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-green-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-green-600"
					>
						Sign Up
					</button>
				</form>
				<p className="text-gray-600 mt-4">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-500 hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
