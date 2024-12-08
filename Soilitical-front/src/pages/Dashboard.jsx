import React, { useState, useEffect } from "react";
import { getUserHistory, createUserHistory, deleteUserHistory } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useLoading } from "../context/LoadingContext";

const Dashboard = () => {
	const navigate = useNavigate();
	const [userHistory, setUserHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showHistory, setShowHistory] = useState(true);
	const [username, setUsername] = useState("");
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const { showLoader } = useLoading();

	const SOIL_TYPE_CHOICES = [
		{ value: "loamy soil", label: "Loamy Soil" },
		{ value: "clayey soil - loamy soil", label: "Clayey Soil - Loamy Soil" },
		{ value: "well-drained - loamy soil", label: "Well-drained - Loamy Soil" },
		{ value: "sandy clay", label: "Sandy Clay" },
		{ value: "sandy loam - silt loam", label: "Sandy Loam - Silt Loam" }
	];

	const [formData, setFormData] = useState({
		soil_type: "loamy soil",
		n_value: "",
		p_value: "",
		k_value: "",
		ec_value: "",
		temperature: ""
	});
	const [prediction, setPrediction] = useState(null);
	const [quickTryLoading, setQuickTryLoading] = useState(false);
	const [quickTryError, setQuickTryError] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			navigate("/login");
			return;
		}

		try {
			const decodedToken = jwtDecode(token);
			setUsername(decodedToken.username || "User");
		} catch (err) {
			console.error("Error decoding token:", err);
			navigate("/login");
			return;
		}

		const fetchHistory = async () => {
			try {
				const response = await getUserHistory();
				setUserHistory(response.data);
			} catch (err) {
				if (err.response?.status === 401) {
					navigate("/login");
				} else {
					setError("Failed to fetch history");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, [navigate]);

	const handleQuickTryChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const generateRandomValuesAndSubmit = () => {
		const randomFormData = {
			soil_type:
				SOIL_TYPE_CHOICES[Math.floor(Math.random() * SOIL_TYPE_CHOICES.length)]
					.value,
			ec_value: (Math.random() * 4).toFixed(2),
			temperature: (Math.random() * 25 + 10).toFixed(1),
			n_value: (Math.random() * 40 + 20).toFixed(2),
			p_value: (Math.random() * 20 + 10).toFixed(2),
			k_value: (Math.random() * 25 + 15).toFixed(2)
		};
		setFormData(randomFormData);
		handleQuickTrySubmit({ preventDefault: () => {} });
	};

	const resetForm = () => {
		setFormData({
			soil_type: "loamy soil",
			n_value: "",
			p_value: "",
			k_value: "",
			ec_value: "",
			temperature: ""
		});
		setPrediction(null);
		setQuickTryError("");
	};

	const handleLogout = () => {
		showLoader();
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		navigate("/login");
	};

	const handleQuickTrySubmit = async (e) => {
		e.preventDefault();
		setQuickTryLoading(true);
		setQuickTryError("");

		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				navigate("/login");
				return;
			}

			// First get the model prediction
			const modelResponse = await axios.post(
				import.meta.env.VITE_MODEL_URL,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			// Make sure we're getting the correct prediction value
			// Log the entire response to see its structure
			console.log("Full Model Response:", modelResponse.data);

			// The prediction might be nested differently in the response
			// Adjust this line based on the actual response structure
			const modelPrediction =
				modelResponse.data.crop_name || modelResponse.data.prediction;
			console.log("Model Prediction:", modelPrediction);

			if (!modelPrediction) {
				throw new Error("No prediction received from the model");
			}

			// Set the prediction in state first
			setPrediction(modelPrediction);

			// Create history data with the confirmed prediction
			const historyData = {
				...formData,
				prediction: modelPrediction
			};

			// Save to history
			const saveResponse = await createUserHistory(historyData);
			console.log("Saved Response:", saveResponse.data);

			// Update UI
			setUserHistory((prev) => [...prev, saveResponse.data]);
		} catch (err) {
			console.error("Error:", err);
			if (err.response?.status === 401) {
				navigate("/login");
			} else {
				setQuickTryError("Failed to make a prediction. Try again.");
			}
		} finally {
			setQuickTryLoading(false);
		}
	};

	const handleDeleteEntry = async (entryId) => {
		try {
			await deleteUserHistory(entryId);
			setUserHistory((prev) => prev.filter((entry) => entry.id !== entryId));
		} catch {
			setError("Failed to delete entry.");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	return (
		<div
			className="mx-auto px-48 py-8"
			style={{
				backgroundImage:
					"url('/images/background.jpeg') ,linear-gradient(to right, rgba(84, 170, 240, 0.4), rgba(36, 139, 255, 0.4), rgba(0, 59, 107, 0.8))",
				backgroundBlendMode: "overlay",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundAttachment: "fixed"
			}}
		>
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6 relative">
				<h1 className="text-2xl md:text-3xl font-bold  bg-white p-4 shadow-md shadow-black from-green-600 to-blue-600 text-transparent bg-clip-text">
					Welcome back, {username}! <span className="text-white">👋</span>
				</h1>

				{/* Profile Menu */}
				<div className="relative">
					<button
						onClick={() => setShowProfileMenu(!showProfileMenu)}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>

					{showProfileMenu && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border">
							<div className="p-4 border-b">
								<p className="font-medium">{username}</p>
							</div>
							<button
								onClick={handleLogout}
								className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Form and Prediction Section */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Form Section */}
				<div className="w-full md:w-1/2 bg-gray-800 text-white p-6 rounded-lg">
					<h2 className="text-xl font-semibold mb-4 text-center">
						Quick Soil Prediction
					</h2>
					<form onSubmit={handleQuickTrySubmit} className="space-y-4">
						<div>
							<label className="block mb-2 text-sm font-medium">
								Soil Type
							</label>
							<select
								name="soil_type"
								value={formData.soil_type}
								onChange={handleQuickTryChange}
								className="w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white"
							>
								{SOIL_TYPE_CHOICES.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{["n_value", "p_value", "k_value", "ec_value", "temperature"].map(
							(field) => (
								<div key={field}>
									<label className="block mb-2 capitalize">
										{field.replace("_value", "").replace("_", " ")}
										{field === "n_value" && " (kg)"}
										{field === "p_value" && " (kg)"}
										{field === "k_value" && " (kg)"}
										{field === "ec_value" && " (dS/m)"}
										{field === "temperature" && " (°C)"}
									</label>
									<input
										type="number"
										name={field}
										value={formData[field]}
										onChange={handleQuickTryChange}
										className="w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white"
										required
										step="any"
									/>
								</div>
							)
						)}

						<div className="flex justify-between mt-4">
							<button
								type="submit"
								className={`px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 ${
									quickTryLoading && "opacity-50 cursor-not-allowed"
								}`}
								disabled={quickTryLoading}
							>
								{quickTryLoading ? "Loading..." : "Submit"}
							</button>
							<button
								type="button"
								onClick={generateRandomValuesAndSubmit}
								className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
								disabled={quickTryLoading}
							>
								Randomize
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600"
							>
								Clear
							</button>
						</div>
					</form>
				</div>

				{/* Prediction Section */}
				<div className="w-full md:w-1/2 ring-2 ring-black shadow-md shadow-black flex flex-col items-center justify-center bg-gray-700 p-4 rounded-md min-h-[300px]">
					{quickTryError ? (
						<p className="text-red-500">{quickTryError}</p>
					) : prediction ? (
						<>
							<h3 className="text-xl font-semibold mb-2 text-white">
								Prediction Result:
							</h3>
							<p className="text-2xl text-white">{prediction}</p>
							<img
								src={`/images/${prediction}.jpg`}
								alt={prediction}
								className="mt-4 w-96 h-56 rounded-md shadow-md shadow-black hover:scale-105 duration-500 hover:shadow-lg"
							/>
						</>
					) : (
						<p className="text-gray-400">
							No prediction yet. Fill the form and submit.
						</p>
					)}
				</div>
			</div>

			{/* History Section */}
			<div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mt-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Your Soil Test History</h2>
					<button
						onClick={() => setShowHistory(!showHistory)}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
					>
						{showHistory ? "Hide History" : "Show History"}
					</button>
				</div>

				{showHistory &&
					(userHistory.length === 0 ? (
						<p>No history found. Try testing some soil samples!</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full table-auto">
								<thead>
									<tr className="bg-gray-100">
										<th className="px-4 py-2 whitespace-nowrap">Date</th>
										<th className="px-4 py-2 whitespace-nowrap">Soil Type</th>
										<th className="px-4 py-2">N</th>
										<th className="px-4 py-2">P</th>
										<th className="px-4 py-2">K</th>
										<th className="px-4 py-2">EC</th>
										<th className="px-4 py-2">Temp</th>
										<th className="px-4 py-2">Prediction</th>
										<th className="px-4 py-2">Actions</th>
									</tr>
								</thead>
								<tbody>
									{userHistory.map((entry) => (
										<tr key={entry.id} className="border-b hover:bg-gray-50">
											<td className="px-4 py-2 text-center whitespace-nowrap">
												{new Date(entry.timestamp).toLocaleDateString()}
											</td>
											<td className="px-4 py-2 text-center whitespace-nowrap">
												{entry.soil_type}
											</td>
											<td className="px-4 py-2 text-center">{entry.n_value}</td>
											<td className="px-4 py-2 text-center">{entry.p_value}</td>
											<td className="px-4 py-2 text-center">{entry.k_value}</td>
											<td className="px-4 py-2 text-center">
												{entry.ec_value}
											</td>
											<td className="px-4 py-2 text-center">
												{entry.temperature}
											</td>
											<td className="px-4 py-2">
												<div className="flex flex-col items-center">
													<span className="font-medium text-gray-900 mb-2">
														{entry.prediction}
													</span>
													<img
														src={`/images/${entry.prediction}.jpg`}
														alt={entry.prediction}
														className="w-20 h-20 object-cover rounded-lg shadow-md"
													/>
												</div>
											</td>
											<td className="px-4 py-2 text-center">
												<button
													onClick={() => handleDeleteEntry(entry.id)}
													className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					))}
			</div>
		</div>
	);
};

export default Dashboard;
