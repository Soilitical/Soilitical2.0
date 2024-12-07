import React, { createContext, useState, useContext } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);

	const showLoader = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1500); // 1.5 seconds
	};

	return (
		<LoadingContext.Provider value={{ showLoader }}>
			{isLoading && <LoadingSpinner />}
			{children}
		</LoadingContext.Provider>
	);
};

export const useLoading = () => useContext(LoadingContext);
