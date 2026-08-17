"use client";

import React from "react";

interface RedWaxSealProps {
  size?: number;
  animate?: boolean;
  className?: string;
  text?: string;
}

export const RedWaxSeal: React.FC<RedWaxSealProps> = ({
  size = 90,
  animate = true,
  className = "",
  text = "COMPLETED",
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${
        animate ? "animate-wax-stamp" : ""
      } ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.45))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Wax Gradient */}
          <radialGradient id="waxGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C8382C" />
            <stop offset="45%" stopColor="#8F241C" />
            <stop offset="85%" stopColor="#5A140F" />
            <stop offset="100%" stopColor="#3B0B07" />
          </radialGradient>

          {/* Inner Rim Gradient */}
          <linearGradient id="waxRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9493B" />
            <stop offset="50%" stopColor="#8F241C" />
            <stop offset="100%" stopColor="#450E0A" />
          </linearGradient>

          {/* Glossy Specular Highlight */}
          <linearGradient id="waxHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
          </linearGradient>

          {/* Organic Scalloped Wax Shape Filter */}
          <filter id="waxTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Outer Irregular Wax Blob */}
        <path
          d="M 50 5 
             C 65 3, 80 12, 88 24 
             C 96 36, 98 52, 92 68 
             C 86 84, 72 95, 54 96 
             C 36 97, 18 88, 10 74 
             C 2 60, 4 42, 14 26 
             C 24 10, 35 7, 50 5 Z"
          fill="url(#waxGrad)"
          filter="url(#waxTexture)"
        />

        {/* Specular Gloss Overlay */}
        <path
          d="M 50 5 
             C 65 3, 80 12, 88 24 
             C 96 36, 98 52, 92 68 
             C 86 84, 72 95, 54 96 
             C 36 97, 18 88, 10 74 
             C 2 60, 4 42, 14 26 
             C 24 10, 35 7, 50 5 Z"
          fill="url(#waxHighlight)"
          opacity="0.6"
        />

        {/* Inner Raised Rim Circle */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="url(#waxRim)"
          strokeWidth="3.5"
          opacity="0.9"
        />

        {/* Inner Debossed Seal Bed */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="#781D16"
          stroke="#4D100B"
          strokeWidth="1.5"
        />

        {/* Star / Emblem Graphics in Center */}
        <g opacity="0.45" transform="translate(50, 50) scale(0.65)">
          <path
            d="M0 -22 L5 -7 L20 -7 L8 2 L13 17 L0 8 L-13 17 L-8 2 L-20 -7 L-5 -7 Z"
            fill="#FFA59E"
          />
        </g>

        {/* Circular Embossed Text path */}
        <path
          id="sealTextPath"
          d="M 23, 50 A 27, 27 0 1, 1 77, 50"
          fill="none"
        />

        <text
          fill="#F5B2AB"
          fontSize="7.5"
          fontWeight="bold"
          fontFamily="Space Mono, monospace"
          letterSpacing="2.5"
          opacity="0.85"
        >
          <textPath href="#sealTextPath" startOffset="50%" textAnchor="middle">
            ZERO DAY
          </textPath>
        </text>

        {/* Center Stamped Text */}
        <text
          x="50"
          y="54"
          fill="#FCE3E1"
          fontSize="7"
          fontWeight="bold"
          fontFamily="Space Mono, monospace"
          textAnchor="middle"
          letterSpacing="1.2"
          opacity="0.9"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
