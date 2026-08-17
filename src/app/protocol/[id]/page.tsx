"use client";

import React, { useEffect, use } from "react";
import Link from "next/link";
import { getProtocolById } from "@/lib/protocols";
import { LevelContent } from "@/components/level/LevelContent";
import { useProtocolStore } from "@/stores/useProtocolStore";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LevelPage({ params }: PageProps) {
  const { id } = use(params);
  const initStore = useProtocolStore((state) => state.initStore);
  const protocol = getProtocolById(id);

  useEffect(() => {
    initStore();
  }, [initStore]);

  if (!protocol) {
    return (
      <main className="min-h-screen bg-[#0D0C0B] text-[#E8E2D5] flex items-center justify-center p-6 text-center font-mono">
        <div className="max-w-md space-y-6">
          <div className="text-3xl font-bold font-headline text-[#FFC928]">
            PROTOCOL NOT FOUND
          </div>
          <p className="text-sm text-[#A49B91]">
            The requested protocol ID [{id}] does not exist in the classified database archive.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F1C18] border border-[#FFC928] text-[#FFC928] font-bold text-xs uppercase tracking-widest hover:bg-[#FFC928] hover:text-[#0D0C0B] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO ARCHIVE</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#12100E] text-[#E8E2D5] overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-20" />
      <div className="max-w-5xl mx-auto py-6 sm:py-8">
        <LevelContent protocol={protocol} />
      </div>
    </main>
  );
}
