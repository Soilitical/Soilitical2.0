// src/components/MapPicker.jsx
import React, { useState, useEffect, useRef } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	Popup
} from "react-leaflet";

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

	// Reset the marker if the map is closed
	useEffect(() => {
		if (!showMap) {
			setMarkerPosition(null);
		}
	}, [showMap]);

	const handleMapClick = (latlng) => {
		setMarkerPosition(latlng);
		onLocationSelected(latlng);
	};

	if (!showMap) return null; // Don't render if overlay is not visible

	return (
		<div className="fixed inset-0 mt-4 bg-black bg-opacity-70 flex items-center justify-center z-50">
			{/* Outer Wrapper */}
			<div className="relative w-11/12 h-5/6 bg-white rounded-md overflow-hidden shadow-lg">
				{/* Close button at a very high z-index */}
				<button
					className="absolute top-3  right-3 z-[9999] bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
					onClick={onClose}
				>
					Close
				</button>

				{/* Weather Info on top-right, also very high z-index */}
				{weatherInfo && (
					<div className="absolute top-3 mr-4 right-16 z-[9999] bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-md shadow-md text-sm">
						{weatherInfo}
					</div>
				)}

				{/* Leaflet Map */}
				<MapContainer
					center={[26.8206, 30.8025]} // roughly center of Egypt
					zoom={6}
					style={{
						width: "100%",
						height: "100%",
						cursor: "crosshair",
						zIndex: 0
					}}
					className="leaflet-container"
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					/>
					<MapClickHandler onMapClick={handleMapClick} />
					{markerPosition && (
						<Marker position={markerPosition}>
							<Popup>
								You picked: {markerPosition.lat.toFixed(4)},{" "}
								{markerPosition.lng.toFixed(4)}
							</Popup>
						</Marker>
					)}
				</MapContainer>
			</div>
		</div>
	);
}
