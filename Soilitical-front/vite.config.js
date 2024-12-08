import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL || "http://127.0.0.1:8000", // Default to local if the env var is not set
				changeOrigin: true,
				secure: false
			}
		}
	}
});
