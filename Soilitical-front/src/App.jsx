import { BrowserRouter, Routes, Route } from "react-router-dom";
import BaseLayout from "./BaseLayout";
import Login from "./pages/Login"; // Import the Login component
import Signup from "./pages/Signup"; // Import the Login component
import QuickTry from "./pages/QuickTry"; // Import the Login component

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<BaseLayout />}>
					<Route index element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/quicktry" element={<QuickTry />} />
					<Route path="/signup" element={<Signup />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
