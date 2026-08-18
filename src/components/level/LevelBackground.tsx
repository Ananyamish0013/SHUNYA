"use client";

import React, { useState, useEffect } from "react";

export const LevelBackground: React.FC = () => {
  const [glitching, setGlitching] = useState(false);
  const [glitchSlice, setGlitchSlice] = useState<{ top: number; height: number; offsetX: number }[]>([]);

  useEffect(() => {
    // Intermittent old CRT TV transmission glitch burst (every 3.5 - 6.5 seconds)
    const scheduleGlitch = () => {
      const interval = 3500 + Math.random() * 3000;
      return setTimeout(() => {
        // Thinner glitch lines (1px to 3px)
        const slices = [
          { top: Math.floor(Math.random() * 85), height: 1 + Math.floor(Math.random() * 3), offsetX: (Math.random() - 0.5) * 28 },
          { top: Math.floor(Math.random() * 85), height: 1 + Math.floor(Math.random() * 3), offsetX: (Math.random() - 0.5) * -24 },
          { top: Math.floor(Math.random() * 85), height: 1 + Math.floor(Math.random() * 2), offsetX: (Math.random() - 0.5) * 36 },
        ];
        setGlitchSlice(slices);
        setGlitching(true);

        setTimeout(() => {
          setGlitching(false);
          timerId = scheduleGlitch();
        }, 260);
      }, interval);
    };

    let timerId = scheduleGlitch();

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0A0908]">
      {/* 1. CLEAN CROPPED APOCALYPTIC BACKGROUND IMAGE */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-100 scale-[1.03] ${
          glitching ? "brightness-125 contrast-125 blur-[0.5px]" : "opacity-90"
        }`}
        style={{ backgroundImage: "url('/assets/level-apocalypse-bg.png')" }}
      />

      {/* Subtle tint overlay for text legibility */}
      <div className="absolute inset-0 bg-[#0A0908]/20" />

      {/* 2. CRT SCANLINES & TV NOISE OVERLAY */}
      <div className="absolute inset-0 crt-scanlines opacity-45 mix-blend-overlay" />

      {/* 3. THIN RED INTERMITTENT CRT TV GLITCH BARS */}
      {glitching && (
        <>
          {glitchSlice.map((slice, idx) => (
            <div
              key={idx}
              className="absolute w-full bg-[#8F241C]/40 border-y border-[#8F241C]/80 z-10"
              style={{
                top: `${slice.top}%`,
                height: `${slice.height}px`,
                transform: `translateX(${slice.offsetX}px)`,
              }}
            />
          ))}
          {/* CRT Red Channel Shift Overlay */}
          <div
            className="absolute inset-0 bg-[#8F241C]/25 mix-blend-color-dodge z-10"
            style={{ transform: "translateX(2px)" }}
          />
        </>
      )}

      {/* 4. OLD TV SCREEN VIGNETTE */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.7)]" />
    </div>
  );
};
