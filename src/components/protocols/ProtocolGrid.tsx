"use client";

import React, { useEffect } from "react";
import { PROTOCOLS_DATA } from "@/lib/protocols";
import { ProtocolCard } from "./ProtocolCard";
import { useProtocolStore } from "@/stores/useProtocolStore";

export const ProtocolGrid: React.FC = () => {
  const initStore = useProtocolStore((state) => state.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <section className="w-full">
      {/* Scattered Physical Document Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-16 gap-x-8 lg:gap-x-14 pb-24 pt-4">
        {PROTOCOLS_DATA.map((protocol, index) => (
          <ProtocolCard key={protocol.id} protocol={protocol} index={index} />
        ))}
      </div>
    </section>
  );
};
