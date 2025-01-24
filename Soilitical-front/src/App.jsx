import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./BaseLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import QuickTry from "./pages/QuickTry";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeContext"; // Add ThemeProvider

function App() {
	return (
		<ThemeProvider>
			{" "}
			{/* Wrap everything in ThemeProvider */}
			<LoadingProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<BaseLayout />}>
							<Route index element={<Navigate to="/dashboard" />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/quicktry" element={<QuickTry />} />
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoadingProvider>
		</ThemeProvider>
	);
}

export default App;
