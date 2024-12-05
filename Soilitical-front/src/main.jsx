// src/main.jsx or src/index.js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Import the Tailwind CSS file
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
