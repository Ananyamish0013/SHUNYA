"use client";

import React, { useState } from "react";
import { ProtocolHeader } from "@/components/protocols/ProtocolHeader";
import { ProtocolGrid } from "@/components/protocols/ProtocolGrid";
import { ApocalypseBackground } from "@/components/level/ApocalypseBackground";
import { ExpandCollapseToggle } from "@/components/level/ExpandCollapseToggle";

export default function MissionProtocolsPage() {
  const [expanded, setExpanded] = useState(true);

  return (
    <main className="relative min-h-screen bg-[#0D0C0B] overflow-hidden">
      {/* Zero Day Apocalypse Background Environment */}
      <ApocalypseBackground
        contracted={!expanded}
        onExpand={() => setExpanded(true)}
      />

      {/* Expand/Collapse Mission Protocols Panel Container with Red/Orange Post-Apocalyptic Background */}
      <div
        className={`fixed inset-0 z-40 w-full shadow-2xl transition-transform duration-500 ease-in-out overflow-y-auto ${
          expanded ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundImage: "url('/assets/mission-protocols-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Subtle dark overlay to preserve readability of protocol cards and UI */}
        <div className="fixed inset-0 bg-[#0D0C0B]/40 pointer-events-none z-0" />

        {/* Background Subtle Atmospheric CRT Scanline & Grain Grid Overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(255, 201, 40, 0.05) 0%, transparent 70%)",
          }}
        />
        <div className="fixed inset-0 pointer-events-none crt-scanlines opacity-40 z-0" />

        {/* Main Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ProtocolHeader />
          <ProtocolGrid />
        </div>
      </div>

      {/* Persistent Sidebar Toggle Control */}
      <ExpandCollapseToggle
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />
    </main>
  );
}
