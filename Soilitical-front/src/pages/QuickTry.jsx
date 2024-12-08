import React, { useState } from "react";
import axios from "axios";

const QuickTry = () => {
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await axios.post(
				import.meta.env.VITE_MODEL_URL,
				formData
			);
			setPrediction(response.data.prediction);
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"An error occurred while making the prediction, Please try"
			);
		} finally {
			setLoading(false);
		}
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
		setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100); // Slight delay
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
						<div className="mb-4">
							<label className="block text-white mb-2 text-lg">Soil Type</label>
							<select
								name="soil_type"
								value={formData.soil_type}
								onChange={handleChange}
								className="w-full p-2 border rounded bg-gray-700 text-white"
							>
								{SOIL_TYPE_CHOICES.map((option) => (
									<option
										key={option.value}
										value={option.value}
										className="text-black"
									>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-2 text-lg">
								Nitrogen (N)
							</label>
							<input
								type="number"
								name="n_value"
								value={formData.n_value}
								onChange={handleChange}
								min="0"
								step="any"
								required
								className="w-full p-2 border rounded bg-gray-700 text-white"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-2 text-lg">
								Phosphorous (P)
							</label>
							<input
								type="number"
								name="p_value"
								value={formData.p_value}
								onChange={handleChange}
								min="0"
								step="any"
								required
								className="w-full p-2 border rounded bg-gray-700 text-white"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-2 text-lg">
								Potassium (K)
							</label>
							<input
								type="number"
								name="k_value"
								value={formData.k_value}
								onChange={handleChange}
								min="0"
								step="any"
								required
								className="w-full p-2 border rounded bg-gray-700 text-white"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-2 text-lg">
								Electrical Conductivity (EC)
							</label>
							<input
								type="number"
								name="ec_value"
								value={formData.ec_value}
								onChange={handleChange}
								min="0"
								max="14"
								step="any"
								required
								className="w-full p-2 border rounded bg-gray-700 text-white"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-2 text-lg">
								Temperature (°C)
							</label>
							<input
								type="number"
								name="temperature"
								value={formData.temperature}
								onChange={handleChange}
								min="-50"
								max="100"
								step="any"
								required
								className="w-full p-2 border rounded bg-gray-700 text-white"
							/>
						</div>

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
								src={`images/${prediction}.jpg`}
								alt="Prediction"
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
		</div>
	);
};

export default QuickTry;
