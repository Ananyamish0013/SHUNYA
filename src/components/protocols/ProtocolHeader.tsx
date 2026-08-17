"use client";

import React from "react";

export const ProtocolHeader: React.FC = () => {
  return (
    <header className="mb-10 pt-6">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-3 border-b border-[#2E2923] text-xs tracking-wider text-[#A49B91]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FFC928] animate-pulse" />
          <span>SYSTEM STATUS: OPERATIONAL</span>
          <span className="text-[#3D3730]">|</span>
          <span>ARCHIVE REPOSITORY</span>
          <span className="text-[#3D3730]">|</span>
          <span>SECTOR 07-B</span>
        </div>

        {/* Warning Box Matching Reference 5 */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1608] border border-[#FFC928] text-[#FFC928] font-bold text-[11px] tracking-widest uppercase">
          <span>▲</span>
          <span>WORLD TERMINATION ABORTED</span>
        </div>
      </div>

      {/* Main Title Heading (Reference 3) */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline tracking-tight text-[#E8E2D5] uppercase drop-shadow-sm">
          MISSION PROTOCOLS
        </h1>
        <p className="text-sm md:text-base text-[#A49B91] tracking-wider uppercase font-mono max-w-3xl">
          CLASSIFIED DIRECTIVES ARCHIVE // SELECT A PROTOCOL TO INITIALIZE TACTICAL OPERATION
        </p>
      </div>

      <div className="mt-6 w-full h-[1px] bg-gradient-to-r from-[#FFC928] via-[#C45A22] to-transparent opacity-40" />
    </header>
  );
};
