import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faLock,
	faEye,
	faEyeSlash,
	faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { registerUser, obtainToken, setAuthToken } from "../api";
import LoadingIndicator from "./LoadingIndicator";
import { useLoading } from "../context/LoadingContext";
import CustomLink from "./CustomLink";

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
		<div className="relative bg-gradient-to-br from-emerald-900/75 to-[#0F766E] shadow-xl p-8 rounded-2xl max-w-md w-full mx-auto border-2 border-[#D4AF37]/20">
			<h2 className="text-3xl font-bold mb-6 text-[#D4AF37] text-center tracking-tight">
				{method === "login" ? "Dashboard Access" : "Register a New Account"}
			</h2>

			{/* Error Message */}
			{error && (
				<div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 mb-4 rounded-lg text-center">
					<p className="text-[#D4AF37] font-medium">
						<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
						{error}
					</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Username Field */}
				<div className="relative group">
					<label
						htmlFor="username"
						className="block text-sm font-medium text-[#D4AF37]/80 mb-1"
					>
						Username
					</label>
					<div className="relative">
						<input
							type="text"
							id="username"
							className="w-full px-4 py-3 bg-emerald-900/40 backdrop-blur-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/30 text-[#D4AF37] placeholder-[#D4AF37]/50 transition-all duration-300"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							required
						/>
						<FontAwesomeIcon
							icon={faUser}
							className="absolute right-4 top-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37]/80 transition-colors"
						/>
					</div>
				</div>

				{/* Password Field */}
				<div className="relative group">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-[#D4AF37]/80 mb-1"
					>
						Password
					</label>
					<div className="relative">
						<input
							type={passwordVisible.password ? "text" : "password"}
							id="password"
							className="w-full px-4 py-3 bg-emerald-900/40 backdrop-blur-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/30 text-[#D4AF37] placeholder-[#D4AF37]/50 transition-all duration-300"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
						/>
						<FontAwesomeIcon
							icon={faLock}
							className="absolute right-4 top-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37]/80 transition-colors"
						/>
						<FontAwesomeIcon
							icon={passwordVisible.password ? faEyeSlash : faEye}
							className="absolute right-12 top-4 text-[#D4AF37]/50 cursor-pointer hover:text-[#D4AF37]/80 transition-colors"
							onClick={() => togglePasswordVisibility("password")}
						/>
					</div>
				</div>

				{/* Confirm Password Field */}
				{showConfirmPassword && (
					<div className="relative group">
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-[#D4AF37]/80 mb-1"
						>
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={passwordVisible.confirmPassword ? "text" : "password"}
								id="confirmPassword"
								className="w-full px-4 py-3 bg-emerald-900/40 backdrop-blur-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/30 text-[#D4AF37] placeholder-[#D4AF37]/50 transition-all duration-300"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm your password"
								required
							/>
							<FontAwesomeIcon
								icon={faLock}
								className="absolute right-4 top-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37]/80 transition-colors"
							/>
							<FontAwesomeIcon
								icon={passwordVisible.confirmPassword ? faEyeSlash : faEye}
								className="absolute right-12 top-4 text-[#D4AF37]/50 cursor-pointer hover:text-[#D4AF37]/80 transition-colors"
								onClick={() => togglePasswordVisibility("confirmPassword")}
							/>
						</div>
					</div>
				)}

				{/* Loading Indicator */}
				{loading && <LoadingIndicator />}

				{/* Submit Button */}
				<button
					type="submit"
					className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] hover:from-[#0F766E] hover:to-[#D4AF37] text-white font-semibold rounded-lg transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-[#D4AF37]/20"
				>
					{method === "login" ? "Login" : "Plant Account"}
				</button>

				{/* Navigation Links */}
				<div className="text-center mt-6 space-y-3">
					{method === "login" ? (
						<p className="text-xl text-[#D4AF37]/80 font-bold">
							New User?{" "}
							<CustomLink
								to="/signup"
								className="text-[#D4AF37] hover:text-[#0F766E]"
							>
								Make an Account
							</CustomLink>
						</p>
					) : (
						<p className="text-[#D4AF37]/80 text-xl font-bold">
							Existing account?{" "}
							<CustomLink
								to="/login"
								className="text-[#D4AF37] hover:text-[#0F766E]"
							>
								Access Dashboard
							</CustomLink>
						</p>
					)}
					<p className="text-[#D4AF37]/80 text-xl font-bold">
						Quick analysis?{" "}
						<CustomLink
							to="/quicktry"
							className="text-[#D4AF37] hover:text-[#0F766E]"
						>
							Try Now
						</CustomLink>
					</p>
				</div>
			</form>
		</div>
	);
}

export default Form;
