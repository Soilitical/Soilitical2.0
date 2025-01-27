// src/components/FireflyBackground.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

const NATURE_ELEMENTS = {
	dark: ["firefly", "moon-sparkle", "star", "orb"],
	light: ["leaf", "flower", "sun-sparkle", "feather", "pollen"]
};

function FireflyBackground() {
	const { isDarkMode } = useTheme();
	const [elements, setElements] = useState([]);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);
	const NUM_ELEMENTS = isDarkMode ? 120 : 80;

	const generateElement = useCallback(
		(initialOpacity = 1) => {
			const type = isDarkMode
				? NATURE_ELEMENTS.dark[
						Math.floor(Math.random() * NATURE_ELEMENTS.dark.length)
				  ]
				: NATURE_ELEMENTS.light[
						Math.floor(Math.random() * NATURE_ELEMENTS.light.length)
				  ];

			return {
				type,
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: getSize(type),
				color: getColor(type),
				animation: getAnimation(type),
				rotation: Math.random() * 360,
				rotationSpeed: isDarkMode
					? Math.random() * 1 - 0.5
					: Math.random() * 4 - 2,
				driftX: isDarkMode ? Math.random() * 3 - 1.5 : Math.random() * 8 - 4,
				driftY: isDarkMode ? Math.random() * 2 - 1 : Math.random() * 4 - 2,
				speed: isDarkMode ? Math.random() * 1 + 0.5 : Math.random() * 3 + 1.5,
				startTime: Date.now(),
				initialOpacity
			};
		},
		[isDarkMode]
	);

	useEffect(() => {
		setElements(Array.from({ length: NUM_ELEMENTS }, () => generateElement(1)));
		const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [generateElement, NUM_ELEMENTS]);

	useEffect(() => {
		let animationFrameId;
		const animate = () => {
			setElements((currentElements) => {
				const now = Date.now();
				return currentElements.map((element) => {
					return element;
				});
			});
			animationFrameId = requestAnimationFrame(animate);
		};
		animate();
		return () => cancelAnimationFrame(animationFrameId);
	}, [generateElement]);

	const getSize = (type) => {
		const darkSizes = {
			firefly: Math.random() * 10 + 8,
			"moon-sparkle": Math.random() * 12 + 8,
			star: Math.random() * 6 + 4,
			orb: Math.random() * 15 + 10
		};

		const lightSizes = {
			leaf: Math.random() * 25 + 15,
			flower: Math.random() * 30 + 20,
			"sun-sparkle": Math.random() * 20 + 10,
			feather: Math.random() * 35 + 15,
			pollen: Math.random() * 10 + 5
		};

		return isDarkMode ? darkSizes[type] || 10 : lightSizes[type] || 10;
	};

	const getColor = (type) => {
		const darkColors = {
			firefly: "#FFE769",
			"moon-sparkle": "#B8C7D6",
			star: "#FFFFFF",
			orb: "#7FA8C0"
		};

		const lightColors = {
			leaf: `hsl(${Math.random() * 40 + 100}, 80%, 50%)`,
			flower: `hsl(${Math.random() * 60 + 300}, 90%, 60%)`,
			"sun-sparkle": "#FFE55C",
			feather: "#FFFFFF",
			pollen: `hsl(${Math.random() * 60 + 50}, 80%, 60%)`
		};

		return isDarkMode ? darkColors[type] : lightColors[type];
	};

	const getAnimation = (type) => {
		const durationMultiplier = isDarkMode
			? 2 + Math.random()
			: 0.5 + Math.random();
		const animations = {
			firefly: `dark-float ${8 * durationMultiplier}s infinite ease-in-out`,
			"moon-sparkle": `dark-pulse ${10 * durationMultiplier}s infinite`,
			star: `dark-twinkle ${12 * durationMultiplier}s infinite`,
			orb: `orb-float ${15 * durationMultiplier}s infinite linear`,
			leaf: `leaf-float ${4 * durationMultiplier}s infinite ease-in-out`,
			flower: `sway ${3.5 * durationMultiplier}s infinite ease-in-out`,
			"sun-sparkle": `sparkle ${2 * durationMultiplier}s infinite ease-in-out`,
			feather: `feather-float ${5 * durationMultiplier}s infinite linear`,
			pollen: `pollen-drift ${6 * durationMultiplier}s infinite linear`
		};
		return animations[type];
	};

	const getCursorStyle = () => {
		const baseSize = isDarkMode ? 120 : 80;
		return {
			width: baseSize + "px",
			height: baseSize + "px",
			background: isDarkMode
				? "radial-gradient(circle, rgba(227,211,105,0.9) 0%, transparent 70%)"
				: "radial-gradient(circle, rgba(255,240,100,0.4) 0%, transparent 80%)",
			transform: `translate(-50%, -50%)`,
			transition: "transform 0.3s ease-out, opacity 0.2s ease",
			opacity: isHovered ? 0.8 : 0.6,
			filter: isDarkMode ? "blur(10px)" : "blur(10px)"
		};
	};

	useEffect(() => {
		const handleMouseEnter = () => setIsHovered(true);
		const handleMouseLeave = () => setIsHovered(false);

		const container = document.querySelector(".firefly-container");
		container?.addEventListener("mouseenter", handleMouseEnter);
		container?.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			container?.removeEventListener("mouseenter", handleMouseEnter);
			container?.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<div
			className={`firefly-container absolute inset-0 pointer-events-none overflow-hidden z-0 ${
				isDarkMode
					? "bg-[#0a0a12]"
					: "bg-gradient-to-b from-sky-100 via-amber-100 to-sky-100"
			}`}
		>
			<div
				className="absolute pointer-events-none transition-opacity"
				style={{
					left: `${mousePos.x}px`,
					top: `${mousePos.y}px`,
					...getCursorStyle()
				}}
			/>

			{!isDarkMode && (
				<div
					className="absolute inset-0 animate-pulse-fast opacity-20"
					style={{
						background: `radial-gradient(circle at 50% 20%, 
              rgba(255,240,100,0.3) 0%,
              rgba(255,240,100,0) 70%)`
					}}
				/>
			)}

			{elements.map((element, index) => {
				const dx = mousePos.x - (window.innerWidth * element.x) / 100;
				const dy = mousePos.y - (window.innerHeight * element.y) / 100;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const angle = Math.atan2(dy, dx);
				const THRESHOLD = isDarkMode ? 300 : 250;
				const repel =
					dist < THRESHOLD ? (THRESHOLD - dist) / (isDarkMode ? 12 : 8) : 0;
				const time = (Date.now() - element.startTime) / 1000;

				return (
					<div
						key={index}
						className="absolute transition-opacity duration-500 ease-out"
						style={{
							left: element.x + "%",
							top: element.y + "%",
							transform: `translate(
                ${Math.cos(angle) * repel + element.driftX * time}px, 
                ${Math.sin(angle) * repel + element.driftY * time}px
              )`,
							willChange: "transform"
						}}
					>
						<div
							className="absolute transition-opacity duration-500 ease-out"
							style={{
								width: element.size,
								height: element.size,
								background: getElementBackground(element),
								borderRadius: isDarkMode ? "50%" : getLightBorder(element.type),
								boxShadow:
									isDarkMode && element.type === "firefly"
										? `0 0 30px 10px ${element.color}80`
										: !isDarkMode
										? `0 0 6px 1px ${element.color}80`
										: "none",
								border: !isDarkMode ? `1px solid ${element.color}` : "none",
								animation: element.animation,
								transform: `rotate(${
									element.rotation + element.rotationSpeed * time
								}deg)
                  ${!isDarkMode ? "scale(1.05)" : ""}`,
								mixBlendMode: isDarkMode ? "screen" : "normal",
								opacity: element.initialOpacity,
								filter:
									isDarkMode && element.type === "firefly"
										? `brightness(1.2) drop-shadow(0 0 15px ${element.color})`
										: "brightness(1)",
								willChange: "transform, opacity"
							}}
						/>
					</div>
				);
			})}

			<style jsx>{`
				@keyframes dark-float {
					0%,
					100% {
						transform: translateY(0) rotate(0deg);
					}
					50% {
						transform: translateY(-40px) rotate(180deg);
					}
				}
				@keyframes dark-pulse {
					0%,
					100% {
						transform: scale(1);
						opacity: 0.8;
					}
					50% {
						transform: scale(1.2);
						opacity: 1;
					}
				}
				@keyframes dark-twinkle {
					0%,
					100% {
						opacity: 0.9;
					}
					50% {
						opacity: 0.4;
					}
				}
				@keyframes orb-float {
					0% {
						transform: translate(-50px, -30px);
					}
					50% {
						transform: translate(50px, -60px);
					}
					100% {
						transform: translate(-50px, -30px);
					}
				}
				@keyframes leaf-float {
					0% {
						transform: translate(-20px, 0) rotate(-15deg) scale(1);
					}
					33% {
						transform: translate(10px, -30px) rotate(10deg) scale(0.9);
					}
					66% {
						transform: translate(20px, -50px) rotate(25deg) scale(0.8);
					}
					100% {
						transform: translate(-20px, 0) rotate(-15deg) scale(1);
					}
				}
				@keyframes sway {
					0% {
						transform: translateX(-20px) rotate(-10deg);
					}
					50% {
						transform: translateX(20px) rotate(10deg);
					}
					100% {
						transform: translateX(-20px) rotate(-10deg);
					}
				}
				@keyframes sparkle {
					0%,
					100% {
						transform: scale(1);
						opacity: 0.8;
					}
					50% {
						transform: scale(2);
						opacity: 1;
					}
				}
				@keyframes feather-float {
					0% {
						transform: translateY(0) rotate(0deg) skew(0deg, 0deg);
					}
					50% {
						transform: translateY(-80px) rotate(180deg) skew(10deg, 5deg);
					}
					100% {
						transform: translateY(0) rotate(360deg) skew(0deg, 0deg);
					}
				}
				@keyframes pollen-drift {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					25% {
						transform: translate(30px, -40px) rotate(90deg);
					}
					50% {
						transform: translate(0, -80px) rotate(180deg);
					}
					75% {
						transform: translate(-30px, -40px) rotate(270deg);
					}
					100% {
						transform: translate(0, 0) rotate(360deg);
					}
				}
			`}</style>
		</div>
	);

	function getElementBackground(element) {
		if (isDarkMode && element.type === "firefly") {
			return `radial-gradient(circle at 50% 50%, ${element.color}, transparent 70%)`;
		}
		if (!isDarkMode) {
			switch (element.type) {
				case "leaf":
					return `linear-gradient(45deg, ${element.color} 0%, hsl(120, 80%, 40%) 100%)`;
				case "flower":
					return `radial-gradient(circle at 30% 30%, ${element.color} 0%, hsl(0, 90%, 50%) 100%)`;
				case "pollen":
					return `radial-gradient(circle at 70% 30%, ${element.color} 0%, hsl(60, 80%, 50%) 100%)`;
				default:
					return element.color;
			}
		}
		return element.color;
	}

	function getLightBorder(type) {
		return type === "flower" ? "30%" : "10%";
	}
}

export default FireflyBackground;
