import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for ReactDOM in React 18+
import "./index.css"; // Import Tailwind CSS
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
