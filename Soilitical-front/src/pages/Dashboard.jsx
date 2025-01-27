// src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { getUserHistory, createUserHistory, deleteUserHistory } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Make sure you have "jwt-decode" installed
import { useLoading } from "../context/LoadingContext";
import MapPicker from "../components/MapPicker"; // Adjust path as needed
import { useTheme } from "../context/ThemeContext";

// Some major Egyptian cities
const EGYPT_CITIES = [
	{ name: "Cairo", lat: 30.0444, lon: 31.2357 },
	{ name: "Alexandria", lat: 31.2001, lon: 29.9187 },
	{ name: "Giza", lat: 30.0131, lon: 31.2089 },
	{ name: "Port Said", lat: 31.2653, lon: 32.3019 },
	{ name: "Suez", lat: 29.9668, lon: 32.5498 },
	{ name: "Luxor", lat: 25.6872, lon: 32.6396 },
	{ name: "Asyut", lat: 27.1869, lon: 31.1711 },
	{ name: "Mansoura", lat: 31.0409, lon: 31.3785 }
];

const Dashboard = () => {
	const navigate = useNavigate();
	const [userHistory, setUserHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showHistory, setShowHistory] = useState(true);
	const [username, setUsername] = useState("");
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const { showLoader } = useLoading();
	const [expandedEntry, setExpandedEntry] = useState(null);
	const { isDarkMode, toggleTheme } = useTheme();

	// Weather
	const [weatherData, setWeatherData] = useState(null);
	const [weatherError, setWeatherError] = useState("");

	// Location
	const [locationMethod, setLocationMethod] = useState("mylocation");
	const [selectedEgyptCity, setSelectedEgyptCity] = useState("Cairo");
	const [customCity, setCustomCity] = useState("");
	const [mapLatLng, setMapLatLng] = useState(null);
	const [showMapOverlay, setShowMapOverlay] = useState(false);

	// Soil analysis form
	const SOIL_TYPE_CHOICES = [
		{ value: "loamy soil", label: "Loamy Soil" },
		{ value: "clayey soil - loamy soil", label: "Clayey-Loamy" },
		{ value: "well-drained - loamy soil", label: "Well-Drained Loam" },
		{ value: "sandy clay", label: "Sandy Clay" },
		{ value: "sandy loam - silt loam", label: "Sandy or Silt Loam" }
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

	// 1) Auth check + fetch history
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

	// 2) Auto-Fetch Weather
	useEffect(() => {
		fetchWeather();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locationMethod, selectedEgyptCity, customCity, mapLatLng]);

	// Fetch Weather helper
	const fetchWeather = async () => {
		setWeatherError("");
		setWeatherData(null);

		const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
		let url = "";

		if (locationMethod === "custom" && !customCity.trim()) {
			setWeatherError("Please enter a city name.");
			return;
		}

		try {
			if (locationMethod === "mylocation") {
				// use geolocation
				if (!("geolocation" in navigator)) {
					throw new Error("Geolocation is not supported by your browser.");
				}
				const position = await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject);
				});
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;
				url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
			} else if (locationMethod === "egyptcity") {
				const cityObj = EGYPT_CITIES.find((c) => c.name === selectedEgyptCity);
				if (!cityObj) throw new Error("Invalid city selection.");
				url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityObj.lat}&lon=${cityObj.lon}&units=metric&appid=${apiKey}`;
			} else if (locationMethod === "custom") {
				url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
					customCity
				)}&units=metric&appid=${apiKey}`;
			} else if (locationMethod === "map") {
				if (!mapLatLng) {
					setWeatherError("Click on the map to pick a location.");
					return;
				}
				const { lat, lng } = mapLatLng;
				url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
			}

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Error fetching weather: ${response.statusText}`);
			}
			const data = await response.json();
			setWeatherData(data);
		} catch (err) {
			setWeatherError(err.message);
		}
	};

	// Handlers
	const handleLogout = () => {
		showLoader();
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		navigate("/login");
	};

	const handleLocationMethodChange = (e) => {
		const chosenMethod = e.target.value;
		setLocationMethod(chosenMethod);
		setWeatherError("");
		setWeatherData(null);

		// If user picks map, open overlay
		if (chosenMethod === "map") {
			setShowMapOverlay(true);
		} else {
			setShowMapOverlay(false);
		}
	};

	const handleSelectedCityChange = (e) => {
		setSelectedEgyptCity(e.target.value);
	};

	const handleCustomCityChange = (e) => {
		setCustomCity(e.target.value);
	};

	const handleMapLocationSelected = (latlng) => {
		setMapLatLng(latlng);
	};

	const handleCloseMap = () => {
		setShowMapOverlay(false);
	};

	const handleQuickTryChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const submitData = async (data) => {
		setQuickTryLoading(true);
		setQuickTryError("");

		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				navigate("/login");
				return;
			}

			// 1) Model prediction
			const modelResponse = await axios.post(
				import.meta.env.VITE_MODEL_URL,
				data,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			const modelPrediction =
				modelResponse.data.crop_name || modelResponse.data.prediction;
			if (!modelPrediction) {
				throw new Error("No prediction received from the model");
			}

			setPrediction(modelPrediction);

			// 2) Save to history
			const historyData = { ...data, prediction: modelPrediction };
			const saveResponse = await createUserHistory(historyData);
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

	const handleQuickTrySubmit = async (e) => {
		e.preventDefault();
		await submitData(formData);
	};

	const generateRandomValuesAndSubmit = async () => {
		if (quickTryLoading) return;
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
		await submitData(randomFormData);
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

	const handleDeleteEntry = async (entryId) => {
		try {
			await deleteUserHistory(entryId);
			setUserHistory((prev) => prev.filter((entry) => entry.id !== entryId));
		} catch {
			setError("Failed to delete entry.");
		}
	};

	const getWeatherEmoji = (description) => {
		if (!description) return "❓";
		const lower = description.toLowerCase();
		if (lower.includes("rain")) return "🌧️";
		if (lower.includes("drizzle")) return "🌦️";
		if (lower.includes("clear")) return "☀️";
		if (lower.includes("cloud")) return "☁️";
		if (lower.includes("snow")) return "❄️";
		if (lower.includes("thunder")) return "⛈️";
		if (lower.includes("mist")) return "🌫️";
		return "🌍";
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	let weatherDisplay = "";
	if (weatherData && weatherData.main) {
		const { temp, humidity } = weatherData.main;
		const description = weatherData.weather?.[0]?.description || "";
		const emoji = getWeatherEmoji(description);
		weatherDisplay = `${emoji} ${temp?.toFixed(1)}°C | Humidity: ${humidity}%`;
	} else if (weatherError) {
		weatherDisplay = `Weather Unavailable: ${weatherError}`;
	}
	const locationOptions = [
		{ value: "mylocation", label: "My Location" },
		{ value: "egyptcity", label: "Egyptian City" },
		{ value: "custom", label: "Custom" },
		{ value: "map", label: "Map" }
	];

	return (
		<div className="mx-auto px-4 md:px-8 py-8  min-h-screen">
			{/* Top Bar */}
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 relative">
				<h1
					className={`text-xl sm:text-2xl font-bold p-1 rounded-md shadow-lg ${
						isDarkMode
							? "text-[#f7ebc3] shadow-black"
							: "text-slate-700 shadow-gray-400"
					}`}
				>
					{username}'s Agricultural Hub{" "}
					<span className={isDarkMode ? "text-white" : "text-gray-700"}>
						🌾
					</span>
				</h1>

				{/* Weather Block */}
				<div className="bg-gray-700 p-3 rounded-lg backdrop-blur-sm my-3 sm:my-0">
					<div className="text-white font-medium">{weatherDisplay}</div>
				</div>

				{/* Profile Menu */}
				<div className="relative">
					<button
						onClick={() => setShowProfileMenu(!showProfileMenu)}
						className="p-2 hover:bg-gray-700 rounded-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-10 text-[#D4AF37]"
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
						<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-600">
							<div className="p-4 border-b border-gray-600">
								<p className="font-medium text-[#D4AF37]">{username}</p>
							</div>
							<button
								onClick={handleLogout}
								className="w-full px-4 py-2 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
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
			{/* Choose Location */}
			<div className="flex justify-center mb-6">
				<div className="w-full md:w-1/2 p-6 bg-gradient-to-br from-gray-700 to-black rounded-2xl shadow-xl backdrop-blur-sm border border-gray-600">
					<h2 className="text-xl font-semibold text-[#D4AF37] mb-4 text-center">
						Choose A Location 📍
					</h2>
					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						{locationOptions.map(({ value, label }) => (
							<label
								key={value}
								className="text-white font-bold flex items-center space-x-2 cursor-pointer"
							>
								<input
									type="radio"
									value={value}
									checked={locationMethod === value}
									onChange={handleLocationMethodChange}
								/>
								<span>{label}</span>
							</label>
						))}
					</div>

					{locationMethod === "egyptcity" && (
						<div className="mt-4">
							<select
								className="w-full text-[#D4AF37] rounded-lg p-3 border border-gray-600"
								value={selectedEgyptCity}
								onChange={handleSelectedCityChange}
							>
								{EGYPT_CITIES.map((city) => (
									<option
										key={city.name}
										value={city.name}
										className="bg-gray-700"
									>
										{city.name}
									</option>
								))}
							</select>
						</div>
					)}

					{locationMethod === "custom" && (
						<div className="mt-4">
							<input
								type="text"
								placeholder="Enter city..."
								className="w-full bg-gray-700 text-[#D4AF37] rounded-lg p-3 border border-gray-600 placeholder-[#D4AF37]/50"
								value={customCity}
								onChange={handleCustomCityChange}
							/>
						</div>
					)}
				</div>
			</div>
			{/* Main Content: Soil Analysis & Prediction */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Soil Analysis Form */}
				<div className="w-full md:w-1/2 bg-gradient-to-br from-gray-700/60 to-black/75 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-600">
					<h2 className="text-2xl text-[#D4AF37] font-bold mb-6 text-center">
						Soil Analysis Portal
					</h2>
					<form onSubmit={handleQuickTrySubmit} className="space-y-6">
						{/* Soil Type */}
						<div>
							<label className="block text-[#D4AF37] mb-3">Soil Type</label>
							<select
								className="w-full bg-gray-700 text-[#D4AF37] rounded-lg p-3 border border-gray-600"
								name="soil_type"
								value={formData.soil_type}
								onChange={handleQuickTryChange}
							>
								{SOIL_TYPE_CHOICES.map((option) => (
									<option
										key={option.value}
										value={option.value}
										className="bg-gray-700"
									>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* N, P, K, EC, Temperature */}
						{["n_value", "p_value", "k_value", "ec_value", "temperature"].map(
							(field) => (
								<div key={field}>
									<label className="block text-[#D4AF37] mb-2 capitalize">
										{field.replace(/_/g, " ").replace("value", "")}
										<span className="text-[#D4AF37]/70 ml-2">
											(
											{
												{
													n_value: "kg/ha",
													p_value: "kg/ha",
													k_value: "kg/ha",
													ec_value: "dS/m",
													temperature: "°C"
												}[field]
											}
											)
										</span>
									</label>
									<input
										type="number"
										className="w-full bg-gray-700 text-[#D4AF37] rounded-lg p-3 border border-gray-600 
                      focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
										name={field}
										value={formData[field]}
										onChange={handleQuickTryChange}
										step="any"
										required
									/>
								</div>
							)
						)}

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 mt-4">
							<button
								type="submit"
								disabled={quickTryLoading}
								className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] hover:from-[#0F766E] hover:to-[#D4AF37] 
                  text-white font-bold py-3 rounded-lg transition-all duration-500 shadow-lg"
							>
								{quickTryLoading ? "Analyzing..." : "Predict"}
							</button>
							<button
								type="button"
								onClick={generateRandomValuesAndSubmit}
								disabled={quickTryLoading}
								className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] font-bold py-3 px-6 
                  rounded-lg transition-colors duration-300 border border-[#D4AF37]/30"
							>
								Randomize
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] font-bold py-3 px-6 
                  rounded-lg transition-colors duration-300 border border-[#D4AF37]/30"
							>
								Clear
							</button>
						</div>
					</form>
				</div>

				{/* Prediction Display */}
				<div
					id="prediction-container"
					className="w-full md:w-1/2 relative bg-gradient-to-br from-[#0F766E]/60 to-black/75 p-6 rounded-2xl shadow-xl 
            min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
				>
					{/* Error / Prediction / Placeholder */}
					{quickTryError ? (
						<div className="bg-gray-700 p-6 rounded-xl backdrop-blur-sm border border-gray-600">
							<p className="text-white text-center">⚠️ {quickTryError}</p>
						</div>
					) : prediction ? (
						<div className="text-center space-y-6">
							<h3 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#0F766E] bg-clip-text text-transparent">
								Optimal Cultivation
							</h3>
							<div className="relative group">
								<img
									src={`/images/${prediction}.jpg`}
									alt={prediction}
									className="w-full h-64 object-cover rounded-xl border-4 border-[#D4AF37]/30 
                    transition-all duration-300 group-hover:border-[#D4AF37]/50"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
								<p className="absolute bottom-0 w-full text-2xl font-bold text-[#D4AF37] p-4">
									{prediction}
								</p>
							</div>
							<div className="bg-gray-700 p-4 rounded-xl backdrop-blur-sm border border-gray-600">
								<p className="text-[#D4AF37] italic">
									"This variety thrives in current soil conditions and local
									climate parameters."
								</p>
							</div>
						</div>
					) : (
						<div className="text-[#D4AF37]/70 text-center">
							<div className="animate-pulse">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-24 w-24 mx-auto mb-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<p className="text-xl">Awaiting Soil Analysis...</p>
							<p className="mt-2">
								Submit your soil parameters to receive cultivation insights
							</p>
						</div>
					)}
				</div>
			</div>
			{/* Cultivation History */}
			<div className="bg-gradient-to-br from-[#2c2c2c] via-[#1a1a1a] to-[#0a0a0a] mt-8 p-6 rounded-2xl backdrop-blur-sm border border-[#D4AF37]/30 shadow-2xl shadow-black/50 relative">
				<div className="absolute inset-0 rounded-2xl border border-[#D4AF37]/10 pointer-events-none" />
				<div className="flex flex-col sm:flex-row justify-between items-center mb-4">
					<h2 className="text-2xl sm:text-3xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent font-bold tracking-wide">
						Predictions History
					</h2>
					<button
						onClick={() => setShowHistory(!showHistory)}
						className="mt-3 sm:mt-0 px-6 py-2 text-sm sm:text-base bg-gradient-to-br from-[#D4AF37] to-[#8B6914] hover:from-[#FFD700] hover:to-[#D4AF37] text-white/90 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-golden-glow"
					>
						{showHistory ? "Collapse History" : "Expand History"}
						<span className="ml-2 text-lg">{showHistory ? "–" : "+"}</span>
					</button>
				</div>

				{showHistory && (
					<div className="mt-6 transition-all duration-500 ease-out">
						{userHistory.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 space-y-4">
								<div className="text-[#D4AF37]/50 text-6xl sm:text-7xl">
									<Icon name="Leaf" /> {/* Replace with your icon component */}
								</div>
								<p className="text-gray-400/80 italic text-lg sm:text-xl">
									Begin your cultivation journey to see records here...
								</p>
							</div>
						) : (
							<div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
								{userHistory
									.slice()
									.reverse()
									.map((entry) => (
										<div
											key={entry.id}
											className="group bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-4 rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/10"
										>
											{/* Entry Header */}
											<div
												className="flex justify-between items-center cursor-pointer"
												onClick={() =>
													setExpandedEntry(
														expandedEntry === entry.id ? null : entry.id
													)
												}
											>
												<div className="space-y-1">
													<h3 className="text-[#FFD700] font-medium text-lg sm:text-xl flex items-center">
														<span className="text-[#D4AF37] mr-2 text-xl sm:text-2xl">
															⏳
														</span>
														{new Date(entry.timestamp).toLocaleDateString(
															undefined,
															{
																year: "numeric",
																month: "long",
																day: "numeric"
															}
														)}
													</h3>
													<p className="text-gray-400/80 text-sm sm:text-base font-mono">
														Soil: {entry.soil_type}
													</p>
												</div>
												<span className="text-[#D4AF37] transform transition-transform duration-300 group-hover:scale-125 text-lg sm:text-xl">
													{expandedEntry === entry.id ? "▼" : "▶"}
												</span>
											</div>

											{/* Expanded Details */}
											{expandedEntry === entry.id && (
												<div className="mt-4 pt-4 border-t border-[#D4AF37]/20 space-y-6">
													<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
														<div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#D4AF37]/10">
															<div className="text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wide mb-1">
																Nitrogen (N)
															</div>
															<div className="text-white/90 font-bold text-base sm:text-lg">
																{entry.n_value} kg/ha
															</div>
														</div>
														<div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#D4AF37]/10">
															<div className="text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wide mb-1">
																Phosphorus (P)
															</div>
															<div className="text-white/90 font-bold text-base sm:text-lg">
																{entry.p_value} kg/ha
															</div>
														</div>
														<div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#D4AF37]/10">
															<div className="text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wide mb-1">
																Potassium (K)
															</div>
															<div className="text-white/90 font-bold text-base sm:text-lg">
																{entry.k_value} kg/ha
															</div>
														</div>
														<div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#D4AF37]/10">
															<div className="text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wide mb-1">
																EC Value
															</div>
															<div className="text-white/90 font-bold text-base sm:text-lg">
																{entry.ec_value} dS/m
															</div>
														</div>
													</div>

													<div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
														<div className="flex items-center space-x-4 flex-1">
															<div className="relative">
																<img
																	src={`/images/${entry.prediction}.jpg`}
																	alt={entry.prediction}
																	className="w-20 h-20 sm:w-36 sm:h-36 object-cover rounded-xl border-2 border-[#D4AF37]/30 shadow-md"
																/>
																<div className="absolute bottom-0 left-0 right-0 bg-black/80 text-center text-[#D4AF37] text-sm sm:text-base py-1 rounded-b-xl">
																	{entry.prediction}
																</div>
															</div>
															<div className="space-y-1">
																<div className="text-[#D4AF37] text-sm sm:text-base">
																	Temperature
																</div>
																<div className="text-white/90 text-2xl sm:text-3xl font-bold">
																	{entry.temperature}°C
																</div>
															</div>
														</div>

														<button
															onClick={() => handleDeleteEntry(entry.id)}
															className="px-6 py-2 text-sm sm:text-base bg-gradient-to-br from-red-600/90 to-red-800/90 hover:from-red-700 hover:to-red-900 text-white/90 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:shadow-red-glow"
														>
															<span className="text-lg">🗑</span>
															<span>Delete Record</span>
														</button>
													</div>
												</div>
											)}
										</div>
									))}
							</div>
						)}
					</div>
				)}
			</div>{" "}
			{/* Map Picker Overlay */}
			<MapPicker
				showMap={showMapOverlay}
				onClose={handleCloseMap}
				onLocationSelected={handleMapLocationSelected}
				weatherInfo={
					<div className="text-[#D4AF37] p-4 bg-gray-700 rounded-lg">
						{weatherDisplay}
					</div>
				}
			/>
		</div>
	);
};

export default Dashboard;
