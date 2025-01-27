// src/components/MapPicker.jsx
import React, { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons using Vite's asset handling
const iconRetinaUrl = new URL(
	"leaflet/dist/images/marker-icon-2x.png",
	import.meta.url
).href;
const iconUrl = new URL("leaflet/dist/images/marker-icon.png", import.meta.url)
	.href;
const shadowUrl = new URL(
	"leaflet/dist/images/marker-shadow.png",
	import.meta.url
).href;

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl,
	iconUrl,
	shadowUrl
});

function MapClickHandler({ onMapClick }) {
	useMapEvents({
		click(e) {
			onMapClick(e.latlng);
		}
	});
	return null;
}

export default function MapPicker({
	onLocationSelected,
	showMap,
	onClose,
	weatherInfo
}) {
	const [markerPosition, setMarkerPosition] = useState(null);

	// Custom marker icon
	const customIcon = useMemo(
		() =>
			new L.Icon({
				iconUrl: "/marker-icon.png",
				iconRetinaUrl: "/marker-icon-2x.png",
				shadowUrl: "/marker-shadow.png",
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			}),
		[]
	);

	useEffect(() => {
		if (!showMap) {
			setMarkerPosition(null);
		}
	}, [showMap]);

	const handleMapClick = (latlng) => {
		setMarkerPosition(latlng);
		onLocationSelected(latlng);
	};

	if (!showMap) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
			<div className="relative w-11/12 h-5/6 bg-white rounded-lg overflow-hidden shadow-xl">
				<button
					className="absolute top-4 right-4 z-[1001] bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
					onClick={onClose}
					aria-label="Close map"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{weatherInfo && (
					<div className="absolute top-4 right-16 z-[1001] bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
						{weatherInfo}
					</div>
				)}

				<MapContainer
					center={[26.8206, 30.8025]}
					zoom={6}
					className="h-full w-full"
					style={{ cursor: "crosshair" }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					/>
					<MapClickHandler onMapClick={handleMapClick} />
					{markerPosition && (
						<Marker position={markerPosition} icon={customIcon}>
							<Popup className="text-sm font-medium">
								Selected location: <br />
								{markerPosition.lat.toFixed(4)}, {markerPosition.lng.toFixed(4)}
							</Popup>
						</Marker>
					)}
				</MapContainer>
			</div>
		</div>
	);
}
