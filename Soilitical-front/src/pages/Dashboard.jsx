// src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { getUserHistory, createUserHistory, deleteUserHistory } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useLoading } from "../context/LoadingContext";

// IMPORT OUR MAPPICKER COMPONENT
import MapPicker from "../components/MapPicker"; // Adjust the path if needed

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

	// WEATHER STATE
	const [weatherData, setWeatherData] = useState(null);
	const [weatherError, setWeatherError] = useState("");

	// LOCATION OPTIONS
	// "mylocation" => geolocation
	// "egyptcity"  => pick from EGYPT_CITIES
	// "custom"     => user typed city
	// "map"        => pick location from interactive map
	const [locationMethod, setLocationMethod] = useState("mylocation");
	const [selectedEgyptCity, setSelectedEgyptCity] = useState("Cairo");
	const [customCity, setCustomCity] = useState("");

	// FOR MAP
	const [mapLatLng, setMapLatLng] = useState(null);
	const [showMapOverlay, setShowMapOverlay] = useState(false);

	// FORM FOR PREDICTION
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

	// -------------------------
	// 1) Check auth, decode token & fetch user history
	// -------------------------
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

	// -------------------------
	// 2) Auto-Fetch Weather
	//    whenever locationMethod, city, or mapLatLng changes
	// -------------------------
	useEffect(() => {
		fetchWeather();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locationMethod, selectedEgyptCity, customCity, mapLatLng]);

	// -------------------------
	// HELPERS: FETCH WEATHER
	// -------------------------
	const fetchWeather = async () => {
		setWeatherError("");
		setWeatherData(null);

		const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
		let url = "";

		// If user typed nothing for customCity, skip
		if (locationMethod === "custom" && !customCity.trim()) {
			setWeatherError("Please enter a city name.");
			return;
		}

		try {
			if (locationMethod === "mylocation") {
				// Use geolocation
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
				// Use selected city from EGYPT_CITIES
				const cityObj = EGYPT_CITIES.find(
					(city) => city.name === selectedEgyptCity
				);
				if (!cityObj) throw new Error("Invalid city selection.");
				url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityObj.lat}&lon=${cityObj.lon}&units=metric&appid=${apiKey}`;
			} else if (locationMethod === "custom") {
				// "custom" => user typed city name
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

	// -------------------------
	// HANDLERS
	// -------------------------
	const handleLocationMethodChange = (e) => {
		const chosenMethod = e.target.value;
		setLocationMethod(chosenMethod);
		setWeatherError("");
		setWeatherData(null);

		// If user picks map, open the overlay
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

	// Called when user picks location on the map
	const handleMapLocationSelected = (latlng) => {
		setMapLatLng(latlng);
	};

	// Closes the map overlay
	const handleCloseMap = () => {
		setShowMapOverlay(false);
		// If we are not going to keep the locationMethod = "map" after closing, you can revert
		// setLocationMethod('mylocation');
	};

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

			// 1) Get model prediction
			const modelResponse = await axios.post(
				import.meta.env.VITE_MODEL_URL,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			const modelPrediction =
				modelResponse.data.crop_name || modelResponse.data.prediction;
			if (!modelPrediction) {
				throw new Error("No prediction received from the model");
			}

			setPrediction(modelPrediction);

			// 2) Save to user's history
			const historyData = {
				...formData,
				prediction: modelPrediction
			};
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

	const handleDeleteEntry = async (entryId) => {
		try {
			await deleteUserHistory(entryId);
			setUserHistory((prev) => prev.filter((entry) => entry.id !== entryId));
		} catch {
			setError("Failed to delete entry.");
		}
	};

	// HELPER: Weather Emoji
	const getWeatherEmoji = (description) => {
		if (!description) return "❓";
		const lowerDesc = description.toLowerCase();
		if (lowerDesc.includes("rain")) return "🌧️";
		if (lowerDesc.includes("drizzle")) return "🌦️";
		if (lowerDesc.includes("clear")) return "☀️";
		if (lowerDesc.includes("cloud")) return "☁️";
		if (lowerDesc.includes("snow")) return "❄️";
		if (lowerDesc.includes("thunder")) return "⛈️";
		if (lowerDesc.includes("mist")) return "🌫️";
		return "🌍"; // fallback emoji
	};

	// RENDER
	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	// For /data/2.5/weather
	let weatherDisplay = "";
	if (weatherData && weatherData.main) {
		const { temp, humidity } = weatherData.main;
		const description = weatherData.weather?.[0]?.description || "";
		const emoji = getWeatherEmoji(description);
		weatherDisplay = `${emoji} ${temp?.toFixed(1)}°C | Humidity: ${humidity}%`;
	} else if (weatherError) {
		weatherDisplay = `Weather Unavailable: ${weatherError}`;
	}

	// This "mapWeatherOverlay" will be shown on the top-right corner in the MapPicker
	const mapWeatherOverlay = weatherDisplay && (
		<div className="text-sm font-medium text-gray-800">{weatherDisplay}</div>
	);

	return (
		<div
			className="mx-auto px-4 py-8"
			style={{
				backgroundImage:
					"url('/images/background.jpeg'), linear-gradient(to right, rgba(84,170,240,0.4), rgba(36,139,255,0.4), rgba(0,59,107,0.8))",
				backgroundBlendMode: "overlay",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundAttachment: "fixed"
			}}
		>
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6 relative">
				<h1 className="text-xl text-white sm:text-2xl md:text-3xl font-bold p-4">
					{username}'s Dashboard! <span className="text-white">👋</span>
				</h1>

				{/* Weather Display (Dashboard) */}
				<div className="flex w-1/4 auto items-center text-lg text-center font-semibold m-auto">
					<div className="bg-white p-2 rounded-md shadow-md shadow-black text-gray-800 ">
						{weatherDisplay}
					</div>
				</div>

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

			{/* LOCATION PANEL */}
			<div className="bg-gray-100/20 p-4 mb-6 rounded-md shadow-md shadow-slate-950 hover:scale-105 duration-500 text-center max-w-2xl m-auto">
				<h2 className="text-xl font-semibold text-gray-700 mb-3">
					Choose A Location📍
				</h2>

				{/* Radio Buttons with improved styling */}
				<div className="flex flex-col sm:flex-row gap-8 m-auto max-w-2xl mb-4 justify-center">
					{[
						{ value: "mylocation", label: "Use My Location" },
						{ value: "egyptcity", label: "Select an Egyptian City" },
						{ value: "custom", label: "Type a City" },
						{ value: "map", label: "Pick from Map" }
					].map((option) => (
						<label
							key={option.value}
							className="relative inline-flex items-center cursor-pointer"
							onClick={() => {
								// If user clicks the same "map" again, forcibly re-open
								if (locationMethod === "map" && option.value === "map") {
									setShowMapOverlay(true);
								}
							}}
						>
							<input
								type="radio"
								className="sr-only peer"
								value={option.value}
								checked={locationMethod === option.value}
								onChange={handleLocationMethodChange}
							/>
							<div className="w-16 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-600 transition-all peer-checked:after:translate-x-5 after:content-[''] after:absolute after:m-auto after:mt-1  after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all" />
							<span className="ml-3 text-gray-700 hover:text-blue-600 transition-colors">
								{option.label}
							</span>
						</label>
					))}
				</div>

				{/* City Selector (Egypt) */}
				{locationMethod === "egyptcity" && (
					<div className="mt-4">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							Pick a city in Egypt:
						</label>
						<select
							className="px-3 py-2 rounded-md border focus:outline-none bg-white"
							value={selectedEgyptCity}
							onChange={handleSelectedCityChange}
						>
							{EGYPT_CITIES.map((city) => (
								<option key={city.name} value={city.name}>
									{city.name}
								</option>
							))}
						</select>
					</div>
				)}

				{/* Custom City Input */}
				{locationMethod === "custom" && (
					<div className="mt-4">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							Enter any city name:
						</label>
						<input
							type="text"
							placeholder="e.g., Paris"
							className="px-3 py-2 rounded-md border focus:outline-none"
							value={customCity}
							onChange={handleCustomCityChange}
						/>
					</div>
				)}
			</div>

			{/* Form and Prediction Section */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Form Section */}
				<div className="w-full bg-gray-800 text-white p-6 rounded-lg">
					<h2 className="text-xl font-semibold mb-4 text-center">
						Enter your readings or randomize some
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
				<div className="w-full ring-2 ring-black shadow-md shadow-black flex flex-col items-center justify-center bg-gray-700 p-4 rounded-md min-h-[300px]">
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
						<div>
							{/* Accordion for Mobile */}
							<div className="block md:hidden space-y-4">
								{userHistory.map((entry) => (
									<div key={entry.id} className="border rounded-lg p-4">
										<div
											className="flex justify-between cursor-pointer"
											onClick={() =>
												setExpandedEntry(
													expandedEntry === entry.id ? null : entry.id
												)
											}
										>
											<h3 className="font-semibold">
												{new Date(entry.timestamp).toLocaleDateString()}
											</h3>
											<span className="text-gray-600">{entry.soil_type}</span>
										</div>
										{expandedEntry === entry.id && (
											<div className="mt-2">
												<p>N: {entry.n_value}</p>
												<p>P: {entry.p_value}</p>
												<p>K: {entry.k_value}</p>
												<p>EC: {entry.ec_value}</p>
												<p>Temp: {entry.temperature}</p>
												<p>Prediction: {entry.prediction}</p>
												<img
													src={`/images/${entry.prediction}.jpg`}
													alt={entry.prediction}
													className="w-20 h-20 object-cover rounded-lg shadow-md mt-2"
												/>
												<button
													onClick={() => handleDeleteEntry(entry.id)}
													className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
												>
													Delete
												</button>
											</div>
										)}
									</div>
								))}
							</div>

							{/* Table for Desktop */}
							<div className="hidden md:block overflow-y-auto max-h-60">
								<table className="min-w-full table-auto">
									<thead>
										<tr className="bg-gray-100">
											<th className="px-4 py-2 text-center">Date</th>
											<th className="px-4 py-2 text-center">Soil Type</th>
											<th className="px-4 py-2 text-center">N</th>
											<th className="px-4 py-2 text-center">P</th>
											<th className="px-4 py-2 text-center">K</th>
											<th className="px-4 py-2 text-center">EC</th>
											<th className="px-4 py-2 text-center">Temp</th>
											<th className="px-4 py-2 text-center">Prediction</th>
											<th className="px-4 py-2 text-center">Actions</th>
										</tr>
									</thead>
									<tbody>
										{userHistory.map((entry) => (
											<tr key={entry.id} className="border-b hover:bg-gray-50">
												<td className="px-4 py-2 text-center">
													{new Date(entry.timestamp).toLocaleDateString()}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.soil_type}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.n_value}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.p_value}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.k_value}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.ec_value}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.temperature}
												</td>
												<td className="px-4 py-2 text-center">
													{entry.prediction}
													<img
														src={`/images/${entry.prediction}.jpg`}
														alt={entry.prediction}
														className="w-20 h-20 m-auto object-cover rounded-lg mt-2"
													/>
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
						</div>
					))}
			</div>

			{/* MAP OVERLAY (Full-Screen) */}
			<MapPicker
				showMap={showMapOverlay}
				onClose={handleCloseMap}
				onLocationSelected={handleMapLocationSelected}
				weatherInfo={mapWeatherOverlay} // pass our weather overlay
			/>
		</div>
	);
};

export default Dashboard;
