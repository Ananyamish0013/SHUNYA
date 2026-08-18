"use client";

import React, { useState, useEffect } from "react";

interface HolographicPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicPanel: React.FC<HolographicPanelProps> = ({ children, className = "" }) => {
  const [projected, setProjected] = useState(false);

  useEffect(() => {
    // Holographic projection initialization sequence
    const timer = setTimeout(() => {
      setProjected(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full my-2 flex flex-col items-center flex-1 h-full">
      {/* 1. Projected Light Cone (Red Thermal Beam from base up to panel) */}
      <div className="w-4/5 h-6 bg-gradient-to-t from-[#8F241C]/35 via-[#C45A22]/15 to-transparent blur-sm -mb-3 pointer-events-none opacity-85" />

      {/* 2. Main Terminal Panel Container */}
      <div
        className={`w-full flex-1 flex flex-col relative transition-all duration-400 ease-out transform origin-bottom ${
          projected
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-y-[0.92] opacity-0 translate-y-4 filter brightness-150"
        } ${className}`}
      >
        {/* Crimson Angular Outer Card matching Post-Apocalyptic Background */}
        <div className="relative w-full flex-1 flex flex-col bg-[#0E0C0B]/92 border border-[#8F241C]/55 rounded-sm backdrop-blur-md shadow-[0_0_40px_rgba(143,36,28,0.25)] overflow-hidden">
          
          {/* Micro Grid Pattern Overlay inside Panel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(143, 36, 28, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(143, 36, 28, 0.15) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Top-Right & Bottom-Left Red Target Reticles */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#8F241C] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#8F241C] pointer-events-none" />
          <div className="absolute top-0 left-0 w-2 h-2 bg-[#8F241C]/70 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#8F241C]/70 pointer-events-none" />

          {/* Glowing Top Crimson Accent Edge */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#8F241C] to-transparent shadow-[0_0_10px_#8F241C]" />

          {/* Panel Inner Content Container */}
          <div className="relative z-10 p-4 sm:p-6 flex-1 flex flex-col h-full">
            {children}
          </div>

          {/* Glowing Bottom Crimson Accent Edge */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#8F241C] to-transparent shadow-[0_0_10px_#8F241C]" />
        </div>
      </div>

      {/* 3. Base Red Emitter Element */}
      <div className="w-2/3 h-1 bg-gradient-to-r from-transparent via-[#8F241C] to-transparent rounded-full shadow-[0_0_16px_#8F241C] mt-1.5 opacity-90" />
    </div>
  );
};
