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
import { registerUser, obtainToken, setAuthToken } from "../api";
import LoadingIndicator from "./LoadingIndicator";
import { useLoading } from "../context/LoadingContext";
import CustomLink from './CustomLink';

function Form({ method, showConfirmPassword, error, setError }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { showLoader } = useLoading();
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState({
		password: false,
		confirmPassword: false
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const togglePasswordVisibility = (field) => {
		setPasswordVisible((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (showConfirmPassword && password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		showLoader();

		try {
			if (method === "signup") {
				await registerUser({
					username,
					password,
					confirm_password: confirmPassword
				});
				navigate("/login");
			} else if (method === "login") {
				const { data } = await obtainToken({ username, password });
				localStorage.setItem("access_token", data.access);
				localStorage.setItem("refresh_token", data.refresh);
				setAuthToken(data.access);
				navigate("/dashboard");
			}
		} catch (err) {
			setError(err.response?.data?.detail || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white shadow-lg p-8 rounded-md max-w-md w-11/12 md:w-full">
			<h2 className="text-3xl font-semibold mb-6 text-gray-800">
				{method === "login" ? "Login" : "Sign Up"}
			</h2>
			{/* Error Message */}
			{error && (
				<div className="bg-red-500 text-white p-3 mb-4 rounded-md">
					<p>
						<FontAwesomeIcon icon={faExclamationTriangle} /> {error}
					</p>
				</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-4">
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
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
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
				{showConfirmPassword && (
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
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-700"
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
				)}
				{loading && <LoadingIndicator />}
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600"
				>
					{method === "login" ? "Login" : "Sign Up"}
				</button>
			</form>
			{/* Navigation Links */}
			<div className="text-center mt-6">
				{method === "login" ? (
					<p className="text-gray-600">
						Don't have an account?{" "}
						<CustomLink to="/signup">Sign Up</CustomLink>
					</p>
				) : (
					<p className="text-gray-600">
						Already have an account?{" "}
						<CustomLink to="/login">Login</CustomLink>
					</p>
				)}
				<p className="text-gray-600 mt-2">
					Quick Try?{" "}
					<CustomLink to="/quicktry">Click Here</CustomLink>
				</p>
			</div>
		</div>
	);
}

export default Form;
