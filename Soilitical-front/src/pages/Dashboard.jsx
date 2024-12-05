import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
	const [formData, setFormData] = useState({
		n_value: "",
		p_value: "",
		k_value: "",
		ph_values: "",
		humidity: "",
		temperature: "",
		rainfall: ""
	});
	const [prediction, setPrediction] = useState(null);
	const [history, setHistory] = useState([]);
	const [showHistory, setShowHistory] = useState(false);

	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = localStorage.getItem("refreshToken");

	useEffect(() => {
		if (!accessToken) {
			// Redirect to login or handle token absence
			console.error("No access token found. Redirecting to login...");
		}
	}, [accessToken]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"/api/predict",
				{ ...formData },
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);
			setPrediction(response.data.prediction);
		} catch (error) {
			if (error.response && error.response.status === 401) {
				// Refresh token logic
				try {
					const refreshResponse = await axios.post("/api/refresh", {
						token: refreshToken
					});
					localStorage.setItem("accessToken", refreshResponse.data.accessToken);
					// Retry the previous request
					handleSubmit(e);
				} catch (refreshError) {
					console.error("Unable to refresh token:", refreshError);
				}
			} else {
				console.error("Error submitting form:", error);
			}
		}
	};

	const fetchHistory = async () => {
		try {
			const response = await axios.get("/api/history", {
				headers: { Authorization: `Bearer ${accessToken}` }
			});
			setHistory(response.data.history);
		} catch (error) {
			console.error("Error fetching history:", error);
		}
	};

	const toggleAndJumpToUserHistory = () => {
		setShowHistory(!showHistory);
		if (!showHistory) fetchHistory();
	};

	return (
		<div id="home-intro2" className="w-full relative h-screen">
			<div className="content w-11/12 xl:w-full absolute left-1/2 text-center">
				<h1 className="w-full text-3xl -mb-1 md:text-5xl">
					<span className="text-green-600">S</span>oilitical
				</h1>
				<p className="text-xl md:text-2xl">
					Your Personal Agriculture AI-Assistant
				</p>

				{/* Form */}
				<form className="mt-8 w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
					<div className="font-bold text-xl w-full">
						<div className="grid grid-cols-4 gap-6">
							{["n_value", "p_value", "k_value", "ph_values"].map((field) => (
								<div key={field} className="col-span-1">
									<label
										htmlFor={field}
										className="block text-lg md:text-xl font-bold text-white"
									>
										{field.toUpperCase().replace("_", " ")}{" "}
										{field === "ph_values" ? "" : "(kg/ha)"}
									</label>
									<input
										type="number"
										name={field}
										id={field}
										min={field === "ph_values" ? "1" : "0"}
										max={field === "ph_values" ? "14" : undefined}
										step={field === "ph_values" ? "any" : undefined}
										value={formData[field]}
										onChange={handleInputChange}
										required
										className="mt-1 focus:ring-indigo-300 md:py-2 md:px-3 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
									/>
								</div>
							))}
						</div>
						<div className="grid w-full grid-cols-3 gap-5 px-6 md:px-20 mt-4">
							{["humidity", "temperature", "rainfall"].map((field) => (
								<div key={field} className="col-span-1">
									<label
										htmlFor={field}
										className="block text-lg md:text-xl font-bold text-white"
									>
										{field.charAt(0).toUpperCase() +
											field.slice(1).replace("_", " ")}{" "}
										{field === "humidity"
											? "(%)"
											: field === "temperature"
											? "(C°)"
											: "(mm/year)"}
									</label>
									<input
										type="number"
										name={field}
										id={field}
										min="0"
										max={field === "humidity" ? "100" : undefined}
										value={formData[field]}
										onChange={handleInputChange}
										required
										className="mt-1 focus:ring-indigo-300 md:py-2 md:px-3 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
									/>
								</div>
							))}
						</div>
						<div className="col-span-4">
							<button
								type="submit"
								className="hero-btn inline-block text-xl font-bold"
							>
								Submit
							</button>
						</div>
					</div>
				</form>

				{prediction && (
					<>
						<h1 className="text-3xl">Prediction: {prediction}</h1>
						<div className="flex w-full justify-center mt-4">
							<img
								id="img"
								className="w-96 rounded-md"
								src={`../static/${prediction}.jpg`}
								alt=""
							/>
						</div>
					</>
				)}
			</div>
			<div>
				<h1
					className="text-2xl inline-block font-black cursor-pointer mb-24 bg-green-700 bg-opacity-50 hover:bg-green-400 hover:bg-opacity-80 px-4 py-2 rounded"
					onClick={toggleAndJumpToUserHistory}
				>
					User History
				</h1>
				{showHistory && (
					<ul id="userHistoryList" className="w-full flex overflow-x-auto">
						{history.map((entry, index) => (
							<li key={index} className="inline-block m-10 w-72">
								<h2 className="text-lg w-72 font-bold">
									Prediction - {entry.prediction} <br />
									Time Entered: {new Date(entry.timestamp).toLocaleString()}
								</h2>
								<div className="w-full justify-center mt-2">
									<img
										id="img"
										className="w-72 h-52 inline-block rounded-md"
										src={`../static/${entry.prediction}.jpg`}
										alt=""
									/>
								</div>
								<p className="text-sm">
									N = {entry.n_value}, P = {entry.p_value}, K = {entry.k_value},
									PH = {entry.ph_values}, Humidity = {entry.humidity},
									Temperature = {entry.temperature}, Rainfall = {entry.rainfall}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
