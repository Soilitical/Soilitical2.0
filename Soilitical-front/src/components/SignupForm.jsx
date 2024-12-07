import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		try {
			const res = await api.post(route, { username, password, confirmPassword });
			if (method === "login") {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate("/");
			} else {
				navigate("/login");
			}
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center justify-center m-12 p-6 rounded-lg shadow-lg max-w-sm mx-auto"
		>
			<h1 className="text-2xl font-semibold mb-4">{name}</h1>
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<input
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder="Confirm Password"
				className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			{loading && <LoadingIndicator />}
			<button
				type="submit"
				className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
			>
				{name}
			</button>
		</form>
	);
}

export default Form;
