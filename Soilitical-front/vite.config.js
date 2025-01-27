import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL || "http://127.0.0.1:8000",
				changeOrigin: true,
				secure: false
			}
		}
	},
	resolve: {
		alias: {
			"leaflet/dist/images": path.resolve(
				__dirname,
				"node_modules/leaflet/dist/images"
			)
		}
	},
	build: {
		assetsInlineLimit: 0 // Ensure marker images are copied as-is
	}
});
