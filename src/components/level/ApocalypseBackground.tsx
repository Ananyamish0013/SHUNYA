"use client";

import React from "react";

interface ApocalypseBackgroundProps {
  onExpand?: () => void;
  contracted?: boolean;
}

export const ApocalypseBackground: React.FC<ApocalypseBackgroundProps> = ({
  onExpand,
  contracted = false,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#0A0908] overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Visual Canvas Artwork matching Reference 5 (Ruined Forest, Ash & Bunker Tunnel) */}
      <div className="absolute inset-0 z-0 opacity-80">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="skyGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#2A241E" />
              <stop offset="60%" stopColor="#12100E" />
              <stop offset="100%" stopColor="#080706" />
            </radialGradient>

            <linearGradient id="fogFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(10,9,8,0)" />
              <stop offset="70%" stopColor="rgba(10,9,8,0.7)" />
              <stop offset="100%" stopColor="rgba(10,9,8,0.98)" />
            </linearGradient>

            <radialGradient id="tunnelInterior" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="80%" stopColor="#12100E" />
              <stop offset="100%" stopColor="#2D2821" />
            </radialGradient>
          </defs>

          {/* Atmospheric Dark Sky */}
          <rect width="1200" height="800" fill="url(#skyGlow)" />

          {/* Distant Burnt Dead Tree Silhouettes (Left & Right Hills) */}
          <g fill="#14110E" opacity="0.85">
            {/* Left Forest Ridge */}
            <path d="M-50 450 Q 150 400 350 480 L 350 800 L -50 800 Z" />
            <polygon points="40,430 46,200 52,430" />
            <polygon points="90,410 97,180 104,410" />
            <polygon points="140,420 145,240 150,420" />
            <polygon points="200,430 206,190 212,430" />
            <polygon points="260,450 264,280 268,450" />
            {/* Branches */}
            <line x1="97" y1="260" x2="70" y2="230" stroke="#14110E" strokeWidth="4" />
            <line x1="97" y1="300" x2="130" y2="270" stroke="#14110E" strokeWidth="4" />
            <line x1="206" y1="280" x2="180" y2="240" stroke="#14110E" strokeWidth="4" />

            {/* Right Forest Ridge */}
            <path d="M 850 480 Q 1050 400 1250 450 L 1250 800 L 850 800 Z" />
            <polygon points="920,440 926,220 932,440" />
            <polygon points="980,420 987,170 994,420" />
            <polygon points="1060,430 1065,210 1070,430" />
            <polygon points="1120,440 1126,250 1132,440" />
            {/* Broken Trunk */}
            <polygon points="1010,430 1018,290 1050,330 1025,430" />
          </g>

          {/* Central Concrete Bunker Tunnel Entrance (Reference 5) */}
          <g transform="translate(600, 510)">
            {/* Concrete Arch Structure */}
            <path
              d="M -220 150 L -220 -30 Q -220 -150 0 -150 Q 220 -150 220 -30 L 220 150 Z"
              fill="#221E19"
              stroke="#3D3730"
              strokeWidth="6"
            />
            {/* Outer Concrete Lip */}
            <path
              d="M -250 150 L -250 -40 Q -250 -180 0 -180 Q 250 -180 250 -40 L 250 150 Z"
              fill="none"
              stroke="#1C1814"
              strokeWidth="16"
            />
            {/* Tunnel Black Hole Interior */}
            <path
              d="M -170 150 L -170 -20 Q -170 -120 0 -120 Q 170 -120 170 -20 L 170 150 Z"
              fill="url(#tunnelInterior)"
            />
          </g>

          {/* Foreground Ash Ground & Debris */}
          <path
            d="M -100 600 Q 300 550 600 590 Q 900 560 1300 610 L 1300 850 L -100 850 Z"
            fill="#0F0D0B"
          />

          {/* Wanderer Silhouettes Standing Near Tunnel (Reference 5) */}
          <g fill="#050504" transform="translate(560, 580) scale(0.85)">
            {/* Wanderer 1 */}
            <ellipse cx="0" cy="-60" rx="7" ry="8" />
            <path d="M -12 -50 L 12 -50 L 16 20 L -16 20 Z" />
            {/* Wanderer 2 (Smaller Child/Companion) */}
            <ellipse cx="25" cy="-40" rx="5" ry="6" />
            <path d="M 17 -32 L 33 -32 L 35 15 L 15 15 Z" />
          </g>

          {/* Ash Fog Bottom Overlay */}
          <rect width="1200" height="800" fill="url(#fogFade)" />
        </svg>
      </div>

      {/* CRT Scanline & Grain Texture Overlay */}
      <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none z-10" />

      {/* Vignette Shadow Frame */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5, 5, 4, 0.85) 100%)",
        }}
      />

      {/* Center Screen Content (Reference 5 Title & Warning Box) */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center space-y-6 animate-fade-in">
        {/* Warning Box Matching Reference 5 */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#17140B] border border-[#FFC928] text-[#FFC928] text-xs font-mono font-bold tracking-[0.25em] uppercase shadow-lg">
          <span>▲</span>
          <span>WORLD TERMINATION ABORTED</span>
        </div>

        {/* Headline Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-headline tracking-tight text-[#EFE7D8] uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
          this will be the login page
        </h1>

        {/* Action Controls in Collapsed Mode */}
        {contracted && (
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            {onExpand && (
              <button
                onClick={onExpand}
                className="px-6 py-3 bg-[#1F1C18] hover:bg-[#FFC928] text-[#FFC928] hover:text-[#0D0C0B] border border-[#FFC928] font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 shadow-xl cursor-pointer"
              >
                [ ENTER ZERO DAY INTERFACE ]
              </button>
            )}

            <button
              onClick={() => alert("TACTICAL TRANSMISSION SIGNAL ACTIVE: ALL SYSTEMS NOMINAL")}
              className="px-6 py-3 bg-[#141210]/90 hover:bg-[#2E2923] text-[#A49B91] hover:text-[#E8E2D5] border border-[#3D3730] font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer"
            >
              [ VIEW TRANSMISSION ]
            </button>
          </div>
        )}
      </div>

      {/* Bottom Post-Apocalyptic Meta Footer */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center text-[10px] font-mono text-[#7A7266] uppercase tracking-widest pointer-events-none">
        <div>COORDINATES: 44.8091° N, 20.4651° E</div>
        <div>ATMOSPHERIC STATUS: TOXIC ASH SATURATION</div>
      </div>
    </div>
  );
};
