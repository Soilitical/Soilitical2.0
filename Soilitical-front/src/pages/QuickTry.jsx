import React, { useState, useEffect } from "react";
import axios from "axios";

const ParticleField = ({ containerId }) => {
	const [particles, setParticles] = useState([]);
	const [interactionPos, setInteractionPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const newParticles = Array.from({ length: 20 }).map(() => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 3 + 1,
			speed: Math.random() * 0.3 + 0.1
		}));
		setParticles(newParticles);

		const handleInteractionMove = (e) => {
			const container = document.getElementById(containerId);
			if (container) {
				const rect = container.getBoundingClientRect();
				let clientX, clientY;

				if (e.touches) {
					clientX = e.touches[0].clientX;
					clientY = e.touches[0].clientY;
				} else {
					clientX = e.clientX;
					clientY = e.clientY;
				}

				setInteractionPos({
					x: ((clientX - rect.left) / rect.width) * 100,
					y: ((clientY - rect.top) / rect.height) * 100
				});
			}
		};

		const containerElement = document.getElementById(containerId);
		if (containerElement) {
			containerElement.addEventListener("mousemove", handleInteractionMove);
			containerElement.addEventListener("touchmove", handleInteractionMove);
		}

		return () => {
			if (containerElement) {
				containerElement.removeEventListener(
					"mousemove",
					handleInteractionMove
				);
				containerElement.removeEventListener(
					"touchmove",
					handleInteractionMove
				);
			}
		};
	}, [containerId]);

	return (
		<>
			{particles.map((particle, i) => {
				const dx = interactionPos.x - particle.x;
				const dy = interactionPos.y - particle.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const angle = Math.atan2(dy, dx);

				return (
					<div
						key={i}
						className="absolute w-2 h-2 bg-[#D4AF37]/30 rounded-full transition-all duration-1000"
						style={{
							left: `${particle.x}%`,
							top: `${particle.y}%`,
							width: `${particle.size}px`,
							height: `${particle.size}px`,
							transform: `translate(${
								distance < 20 ? Math.cos(angle) * 5 : 0
							}px, 
                       ${distance < 20 ? Math.sin(angle) * 5 : 0}px)`,
							opacity: distance < 20 ? 0.7 : 0.3
						}}
					/>
				);
			})}
		</>
	);
};

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

	const handleQuickTrySubmit = async (e) => {
		e.preventDefault();
		await submitData(formData);
	};

	const submitData = async (data) => {
		setLoading(true);
		setError("");

		try {
			const response = await axios.post(import.meta.env.VITE_MODEL_URL, data);
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

	const generateRandomValuesAndSubmit = async () => {
		if (loading) return;

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
		setError(null);
	};

	return (
		<div className="p-4 md:p-6 w-full min-h-screen flex flex-col items-center justify-center text-white">
			<div className="flex flex-col w-full max-w-6xl gap-4 md:gap-8 md:flex-row">
				{/* Form Section */}
				<div className="w-full md:w-3/4">
					<form
						onSubmit={handleQuickTrySubmit}
						className="space-y-4 md:space-y-6 bg-gradient-to-br from-gray-700/60 to-black/75 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl backdrop-blur-sm border border-gray-600"
					>
						<h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 text-center">
							<span className="text-green-500">Soil</span>itical
						</h1>

						<div>
							<label className="block text-[#D4AF37] mb-2 md:mb-3">
								Soil Type
							</label>
							<select
								className="w-full bg-gray-700 text-[#D4AF37] rounded-lg p-2 md:p-3 border border-gray-600 text-sm md:text-base"
								name="soil_type"
								value={formData.soil_type}
								onChange={handleChange}
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

						{["n_value", "p_value", "k_value", "ec_value", "temperature"].map(
							(field) => (
								<div key={field} className="group">
									<label className="block text-[#D4AF37] mb-1 md:mb-2 capitalize text-sm md:text-base">
										{field.replace(/_/g, " ").replace(" value", "")}
										<span className="text-[#D4AF37]/70 ml-2 text-xs md:text-sm">
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
										className="w-full bg-gray-700 text-[#D4AF37] rounded-lg p-2 md:p-3 border border-gray-600 
                           focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm md:text-base"
										name={field}
										value={formData[field]}
										onChange={handleChange}
										step="any"
										required
									/>
								</div>
							)
						)}

						<div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-6 md:mt-8">
							<button
								type="submit"
								disabled={loading}
								className="w-full md:flex-1 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] hover:from-[#0F766E] hover:to-[#D4AF37] 
                       text-white font-bold py-2 md:py-3 rounded-lg transition-all duration-500 shadow-lg text-sm md:text-base"
							>
								{loading ? "Analyzing..." : "Predict"}
							</button>
							<button
								type="button"
								onClick={generateRandomValuesAndSubmit}
								disabled={loading}
								className="w-full md:w-auto bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg 
                       transition-colors duration-300 border border-[#D4AF37]/30 text-sm md:text-base"
							>
								Randomize
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="w-full md:w-auto bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg 
                       transition-colors duration-300 border border-[#D4AF37]/30 text-sm md:text-base"
							>
								Clear
							</button>
						</div>
					</form>
				</div>

				<div
					id="prediction-container"
					className="w-full relative bg-gradient-to-br from-[#0F766E]/60 to-black/75 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-xl 
                     min-h-[300px] md:min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
				>
					<div className="absolute inset-0 opacity-20 pointer-events-none">
						<ParticleField containerId="prediction-container" />
					</div>

					{error ? (
						<div className="flex flex-col items-center space-y-2 md:space-y-4 bg-rose-900/30 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-rose-900/50">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 md:h-16 w-12 md:w-16 text-rose-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<p className="text-rose-300 text-sm md:text-lg font-medium text-center">
								{error}
							</p>
						</div>
					) : prediction ? (
						<div className="text-center space-y-4 md:space-y-6 w-full px-2">
							<h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#0F766E] bg-clip-text text-transparent">
								Optimal Cultivation
							</h3>
							<div className="relative group w-full max-w-xs md:max-w-none mx-auto">
								<img
									src={`/images/${prediction}.jpg`}
									alt={prediction}
									className="w-full h-48 md:h-64 object-cover rounded-lg md:rounded-xl border-4 border-[#D4AF37]/30 
                         transition-all duration-300 group-hover:border-[#D4AF37]/50"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg md:rounded-xl" />
								<p className="absolute bottom-0 w-full text-lg md:text-2xl font-bold text-[#D4AF37] p-3 md:p-4">
									{prediction}
								</p>
							</div>
							<div className="bg-gray-700 p-3 md:p-4 rounded-lg md:rounded-xl backdrop-blur-sm border border-gray-600 mx-2">
								<p className="text-[#D4AF37] italic text-sm md:text-base">
									"This variety thrives in the current soil conditions and
									climate profile."
								</p>
							</div>
						</div>
					) : (
						<div className="text-[#D4AF37]/70 text-center text-sm md:text-base px-4">
							<div className="animate-pulse">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-16 md:h-20 w-16 md:w-20 mx-auto"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<p className="text-lg md:text-xl mt-2">Awaiting Analysis...</p>
							<p className="mt-1 md:mt-2 text-xs md:text-sm">
								Submit soil readings for cultivation insights
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuickTry;
