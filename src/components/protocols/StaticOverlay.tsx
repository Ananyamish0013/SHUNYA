"use client";

import React, { useEffect, useRef } from "react";

interface StaticOverlayProps {
  active: boolean;
}

export const StaticOverlay: React.FC<StaticOverlayProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const renderNoise = () => {
      if (!active) return;
      const imgData = ctx.createImageData(width, height);
      const buffer32 = new Uint32Array(imgData.data.buffer);
      const len = buffer32.length;

      // Draw subtle analog TV static noise
      for (let i = 0; i < len; i++) {
        // Random dark-to-light noise intensity
        const v = Math.floor(Math.random() * 255);
        // Alpha intensity subtle enough to allow text to remain readable
        const alpha = Math.random() < 0.12 ? Math.floor(Math.random() * 90) : Math.floor(Math.random() * 30);
        // Pack ARGB
        buffer32[i] = (alpha << 24) | (v << 16) | (v << 8) | v;
      }

      ctx.putImageData(imgData, 0, 0);

      // Add a couple of moving static horizontal scan interference lines
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      const lineY1 = (Date.now() / 8) % height;
      ctx.fillRect(0, lineY1, width, 2);

      const lineY2 = (Date.now() / 15 + height / 2) % height;
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, lineY2, width, 4);

      animationFrameId = requestAnimationFrame(renderNoise);
    };

    if (active) {
      renderNoise();
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [active]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ease-in-out overflow-hidden ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Procedural Canvas Noise */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-multiply opacity-70"
      />

      /* Fine CRT Horizontal Scanlines Overlay */
      <div className="absolute inset-0 crt-scanlines mix-blend-overlay opacity-80" />

      /* CRT Tube Vignette Darkening Around Edges */
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(10, 9, 8, 0.4) 100%)",
        }}
      />
    </div>
  );
};
