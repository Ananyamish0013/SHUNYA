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
    <div className="w-full p-2.5 sm:p-3 bg-[#0F0E0D]/80 border border-[#2E2923] rounded-sm space-y-2 font-mono text-[#E8E2D5] shadow-sm">
      {/* Header & Digital Countdown */}
      <div className="flex items-center justify-between text-[11px] tracking-wider">
        <div className="flex items-center gap-2 text-[#FFA8A0] font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8F241C] animate-pulse" />
          <span>TIME REMAINING:</span>
          <span className="text-xs font-bold text-[#E8E2D5] bg-[#1F1C18] px-2 py-0.5 border border-[#3D3730]">
            {formatTime(secondsLeft)}
          </span>
        </div>
        <span className="text-[9px] text-[#7A7266] uppercase hidden sm:inline-block">
          WARRIOR ADVANCE PROTOCOL
        </span>
      </div>

      {/* Warrior vs Monster Track */}
      <div className="relative w-full pt-4 pb-1 px-5">
        {/* Track Line */}
        <div className="w-full h-1 bg-[#1F1C18] border border-[#3D3730] relative rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8F241C] to-[#C45A22] transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Moving Warrior Icon */}
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-300 ease-linear flex flex-col items-center"
          style={{ left: `calc(1.25rem + (100% - 2.5rem) * ${progressPercent / 100})` }}
        >
          <img
            src="/assets/warrior.png"
            alt="Warrior"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain image-rendering-pixelated drop-shadow-[0_0_6px_rgba(143,36,28,0.7)]"
          />
          <span className="text-[8px] font-bold text-[#FFA8A0] uppercase mt-0.5 tracking-tighter">
            WARRIOR
          </span>
        </div>

        {/* Fixed Monster Icon on Right End */}
        <div className="absolute top-0 right-2 flex flex-col items-center">
          <img
            src="/assets/monster.png"
            alt="Monster"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain image-rendering-pixelated drop-shadow-[0_0_6px_rgba(143,36,28,0.6)]"
          />
          <span className="text-[8px] font-bold text-[#8F241C] uppercase mt-0.5 tracking-tighter">
            MONSTER
          </span>
        </div>
      </div>
    </div>
  );
};
