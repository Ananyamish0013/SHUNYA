"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpandCollapseToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

export const ExpandCollapseToggle: React.FC<ExpandCollapseToggleProps> = ({
  expanded,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      aria-label={expanded ? "Contract Level Interface" : "Expand Level Interface"}
      title={expanded ? "Contract Interface (Expose Background)" : "Expand Interface (View Level Panel)"}
      className={`group fixed top-1/2 -translate-y-1/2 z-50 flex items-center justify-center p-3 bg-[#1A1815] hover:bg-[#FFC928] border border-[#3D3730] hover:border-[#FFC928] text-[#FFC928] hover:text-[#0D0C0B] shadow-2xl transition-all duration-300 cursor-pointer rounded-sm ${
        expanded ? "right-4 lg:right-6" : "left-4 lg:left-6"
      }`}
    >
      <div className="flex items-center gap-2 font-mono font-bold text-xs tracking-wider">
        {expanded ? (
          <>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            <span className="hidden sm:inline uppercase text-[11px] font-bold">
              [ CONTRACT ]
            </span>
          </>
        ) : (
          <>
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline uppercase text-[11px] font-bold">
              [ EXPAND LEVEL ]
            </span>
          </>
        )}
      </div>
    </button>
  );
};
