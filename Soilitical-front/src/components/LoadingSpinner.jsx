import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-emerald-900/80 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="relative animate-pulse-slow">
        <img
          src="../images/logo.png"
          alt="Soilitical Logo"
          className="w-48 h-48 opacity-90 animate-spin-slow"
        />
        <div className="absolute inset-0 border-4 border-[#D4AF37]/30 rounded-full animate-glow"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;