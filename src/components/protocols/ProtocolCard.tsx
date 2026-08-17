"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Protocol } from "@/lib/protocols";
import { StaticOverlay } from "./StaticOverlay";
import { RedWaxSeal } from "./RedWaxSeal";
import { useProtocolStore } from "@/stores/useProtocolStore";

interface ProtocolCardProps {
  protocol: Protocol;
  index: number;
}

// Organic physical scatter positioning per card index
const SCATTER_STYLES = [
  {
    rotate: "rotate-[-2.1deg]",
    offset: "md:mt-0 md:-ml-3",
  },
  {
    rotate: "rotate-[2.6deg]",
    offset: "md:mt-12 md:ml-3",
  },
  {
    rotate: "rotate-[1.4deg]",
    offset: "md:-mt-2 md:-ml-4",
  },
  {
    rotate: "rotate-[-2.8deg]",
    offset: "md:mt-14 md:ml-4",
  },
  {
    rotate: "rotate-[-1.6deg]",
    offset: "md:mt-2 md:-ml-2",
  },
  {
    rotate: "rotate-[2.3deg]",
    offset: "md:mt-16 md:ml-3",
  },
];

export const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = useProtocolStore((state) => state.isCompleted(protocol.id));

  const scatter = SCATTER_STYLES[index % SCATTER_STYLES.length];

  return (
    <div className={`w-full ${scatter.offset}`}>
      <Link
        href={`/protocol/${protocol.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative block w-full text-left transition-all duration-300 transform ${scatter.rotate} hover:rotate-0 hover:scale-[1.025] hover:-translate-y-2 hover:z-30 focus:outline-none`}
      >
        {/* Outer Card Paper Document Container (Reference 3) */}
        <div className="paper-document relative min-h-[290px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden rounded-sm transition-all duration-300 group-hover:border-[#FFC928]">
          {/* Inner Subtle Dashed Document Border */}
          <div className="paper-document-inner-border absolute inset-2 pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#1C1A17] uppercase">
                {protocol.title}
              </h2>

              {/* Classified Dark Grey Metadata Strip Tag (Reference 3) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#5C554B] uppercase tracking-widest hidden sm:inline">
                  {protocol.sector}
                </span>
                <div className="w-10 h-3 bg-[#A49B91] opacity-70 border border-[#787065] rounded-[1px]" />
              </div>
            </div>

            {/* Thin Horizontal Separator Rule */}
            <div className="w-full h-[1px] bg-[#B0A79A]" />
          </div>

          {/* Card Body Mission Text (Reference 3) */}
          <div className="relative z-10 my-4">
            <p className="text-sm sm:text-base text-[#2E2923] font-mono leading-relaxed font-normal tracking-wide">
              {protocol.description}
            </p>
          </div>

          {/* Card Footer */}
          <div className="relative z-10 pt-4 border-t border-[#C5BDB0] flex items-center justify-between text-xs font-mono font-bold text-[#5C554B]">
            <span className="tracking-widest uppercase">
              {protocol.classifiedTag}
            </span>
            <span className="text-[11px] text-[#7A7266] uppercase">
              CLEARANCE: {protocol.clearanceLevel}
            </span>
          </div>

          {/* CRT Static Hover Shader (Reference 2) */}
          <StaticOverlay active={isHovered} />

          {/* Completed State Red Wax Seal (Reference 4) */}
          {isCompleted && (
            <div className="absolute right-4 bottom-4 z-30 pointer-events-none transform rotate-[8deg]">
              <RedWaxSeal size={96} animate={true} text="COMPLETED" />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
