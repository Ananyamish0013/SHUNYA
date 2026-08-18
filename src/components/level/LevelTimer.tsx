"use client";

import React, { useState, useEffect } from "react";

interface LevelTimerProps {
  initialMinutes?: number;
}

export const LevelTimer: React.FC<LevelTimerProps> = ({ initialMinutes = 5 }) => {
  const totalSeconds = initialMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Calculate percentage of warrior's progress toward the monster (0% to 100%)
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100)
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full p-4 sm:p-5 bg-[#0F0E0D] border border-[#2E2923] rounded-sm space-y-3 font-mono text-[#E8E2D5]">
      {/* Header & Digital Countdown */}
      <div className="flex items-center justify-between text-xs tracking-wider">
        <div className="flex items-center gap-2 text-[#FFC928] font-bold uppercase">
          <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-pulse" />
          <span>TIME REMAINING:</span>
          <span className="text-sm font-bold text-[#E8E2D5] bg-[#1F1C18] px-2 py-0.5 border border-[#3D3730]">
            {formatTime(secondsLeft)}
          </span>
        </div>
        <span className="text-[10px] text-[#7A7266] uppercase hidden sm:inline-block">
          WARRIOR ADVANCE PROTOCOL
        </span>
      </div>

      {/* Warrior vs Monster Track */}
      <div className="relative w-full pt-6 pb-2 px-6">
        {/* Track Line */}
        <div className="w-full h-1.5 bg-[#1F1C18] border border-[#3D3730] relative rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFC928] to-[#C45A22] transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Moving Warrior Icon */}
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-300 ease-linear flex flex-col items-center"
          style={{ left: `calc(1.5rem + (100% - 3rem) * ${progressPercent / 100})` }}
        >
          <img
            src="/assets/warrior.png"
            alt="Warrior"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain image-rendering-pixelated drop-shadow-[0_0_8px_rgba(255,201,40,0.5)]"
          />
          <span className="text-[9px] font-bold text-[#FFC928] uppercase mt-0.5 tracking-tighter">
            WARRIOR
          </span>
        </div>

        {/* Fixed Monster Icon on Right End */}
        <div className="absolute top-0 right-3 flex flex-col items-center">
          <img
            src="/assets/monster.png"
            alt="Monster"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain image-rendering-pixelated drop-shadow-[0_0_8px_rgba(143,36,28,0.6)]"
          />
          <span className="text-[9px] font-bold text-[#8F241C] uppercase mt-0.5 tracking-tighter">
            MONSTER
          </span>
        </div>
      </div>
    </div>
  );
};
