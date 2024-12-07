import React from "react";

const LoadingSpinner = () => {
	return (
		<div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="relative">
				<img
					src="../images/logo.png"
					alt="Soilitical Logo"
					className="w-72 h-72  opacity-0 animate-reveal-logo" // Set initial opacity to 0
				/>
			</div>
		</div>
	);
};

export default LoadingSpinner;
