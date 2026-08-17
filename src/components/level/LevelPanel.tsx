"use client";

import React from "react";
import { Protocol } from "@/lib/protocols";
import { LevelContent } from "./LevelContent";

interface LevelPanelProps {
  protocol: Protocol;
  expanded: boolean;
}

export const LevelPanel: React.FC<LevelPanelProps> = ({
  protocol,
  expanded,
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-40 w-full lg:w-[88%] xl:w-[82%] bg-[#12100E] border-l border-[#2E2923] shadow-2xl transition-transform duration-500 ease-in-out overflow-y-auto ${
        expanded ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Background Subtle Grid & Panel Border Lines */}
      <div className="min-h-screen relative bg-[#12100E]">
        <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-20" />
        <LevelContent protocol={protocol} />
      </div>
    </div>
  );
};
