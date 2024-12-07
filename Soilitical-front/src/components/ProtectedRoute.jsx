import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { refreshToken, setAuthToken } from "../api";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
	const [isAuthorized, setIsAuthorized] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem("access_token");
				if (!token) {
					setIsAuthorized(false);
					return;
				}

				const decoded = jwtDecode(token);
				if (decoded.exp * 1000 < Date.now()) {
					// Token is expired, try to refresh
					try {
						const refreshTokenValue = localStorage.getItem("refresh_token");
						if (!refreshTokenValue) {
							setIsAuthorized(false);
							return;
						}

						const response = await refreshToken({ refresh: refreshTokenValue });
						localStorage.setItem("access_token", response.data.access);
						setAuthToken(response.data.access); // Set the new token in axios
						setIsAuthorized(true);
					} catch (refreshError) {
						// If refresh fails, set unauthorized
						setIsAuthorized(false);
						localStorage.removeItem("access_token");
						localStorage.removeItem("refresh_token");
					}
				} else {
					// Token is still valid
					setAuthToken(token); // Make sure to set the token in axios
					setIsAuthorized(true);
				}
			} catch (error) {
				setIsAuthorized(false);
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
			}
		};

		checkAuth();
	}, []);

	if (isAuthorized === null) return <div>Loading...</div>;
	return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
