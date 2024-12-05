import React, { useState } from "react";

const QuickTry = () => {
	const [formData, setFormData] = useState({
		n_value: "",
		p_value: "",
		k_value: "",
		ph_values: "",
		humidity: "",
		temperature: ""
	});
	const [prediction, setPrediction] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setPrediction(null);

		try {
			const requestBody = {
				N: parseFloat(formData.n_value) || 0,
				P: parseFloat(formData.p_value) || 0,
				K: parseFloat(formData.k_value) || 0,
				Humidity: parseFloat(formData.humidity) || 0,
				Temp: parseFloat(formData.temperature) || 0,
				PH: parseFloat(formData.ph_values) || 0
			};

			const response = await fetch(
				"https://apisoilitical.pythonanywhere.com/predict/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(requestBody)
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch prediction. Please try again.");
			}

			const data = await response.json();
			setPrediction(data.prediction);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const generateRandomValuesAndSubmit = () => {
		const randomFormData = {
			n_value: Math.floor(Math.random() * 50) + 15,
			p_value: Math.floor(Math.random() * 50) + 15,
			k_value: Math.floor(Math.random() * 50) + 15,
			ph_values: (Math.random() * 13 + 1).toFixed(1),
			humidity: Math.floor(Math.random() * 101),
			temperature: Math.floor(Math.random() * 66)
		};
		setFormData(randomFormData);
		setTimeout(() => handleSubmit({ preventDefault: () => {} }), 0);
	};

	const resetForm = () => {
		setFormData({
			n_value: "",
			p_value: "",
			k_value: "",
			ph_values: "",
			humidity: "",
			temperature: ""
		});
		setPrediction(null);
		setError(null);
	};

	return (
		<div className="p-6 w-full min-h-screen flex items-center justify-center bg-gray-800 text-white">
			<div className="flex w-full max-w-6xl gap-8">
				{/* Form Section */}
				<div className="w-1/2">
					<h1 className="text-4xl font-bold mb-4 text-center">
						<span className="text-green-500">S</span>oilitical
					</h1>
					<p className="text-lg text-center mb-6">
						Your Personal Agriculture AI-Assistant
					</p>
					<form onSubmit={handleSubmit} className="space-y-4">
						{[
							{ name: "n_value", label: "N (kg/ha)", min: 15 },
							{ name: "p_value", label: "P (kg/ha)", min: 15 },
							{ name: "k_value", label: "K (kg/ha)", min: 15 },
							{ name: "ph_values", label: "PH", min: 1, max: 14, step: 0.1 },
							{ name: "humidity", label: "Humidity (%)", min: 0, max: 100 },
							{
								name: "temperature",
								label: "Temperature (°C)",
								min: 0,
								max: 65
							}
						].map(({ name, label, ...props }) => (
							<div key={name} className="space-y-2">
								<label
									htmlFor={name}
									className="block font-medium text-xl text-gray-300"
								>
									{label}
									<span className="text-gray-400 text-xl">
										{" "}
										(e.g., {props.min}-{props.max || "varies"})
									</span>
								</label>
								<input
									type="number"
									id={name}
									name={name}
									value={formData[name]}
									onChange={handleChange}
									className="block w-full px-4 py-2 text-black rounded-md shadow-sm focus:ring focus:ring-green-500"
									{...props}
									required
								/>
							</div>
						))}
						<div className="flex justify-between items-center mt-6">
							<button
								type="submit"
								className={`py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold ${
									loading && "opacity-50 cursor-not-allowed"
								}`}
								disabled={loading}
							>
								{loading ? "Submitting..." : "Submit"}
							</button>
							<button
								type="button"
								onClick={generateRandomValuesAndSubmit}
								className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold"
								disabled={loading}
							>
								{loading ? "Generating..." : "Randomize"}
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="py-2 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-bold"
							>
								Clear
							</button>
						</div>
					</form>
				</div>

				{/* Prediction Section */}
				<div className="w-1/2 ring-2 ring-black shadow-md shadow-black flex flex-col items-center justify-center bg-gray-700 p-4 rounded-md">
					{error ? (
						<p className="text-red-500">{error}</p>
					) : prediction ? (
						<>
							<h3 className="text-xl font-semibold mb-2">Prediction Result:</h3>
							<p className="text-2xl">{prediction}</p>
							<img
								id="img"
								className="w-full ring-black ring-2 shadow-lg shadow-black hover:scale-110 duration-500 max-w-xs h-auto rounded-md mt-4"
								src={`../images/${prediction}.jpg`}
								alt={prediction}
							/>
						</>
					) : (
						<p className="text-gray-400">
							No prediction yet. Fill the form and submit.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuickTry;
