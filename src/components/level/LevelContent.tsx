"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Protocol } from "@/lib/protocols";
import { useProtocolStore } from "@/stores/useProtocolStore";
import { RedWaxSeal } from "../protocols/RedWaxSeal";
import { LevelTimer } from "./LevelTimer";
import { LevelBackground } from "./LevelBackground";
import { HolographicPanel } from "./HolographicPanel";
import { ArrowLeft, Send, ChevronDown, ChevronUp } from "lucide-react";

interface LevelContentProps {
  protocol: Protocol;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export const LevelContent: React.FC<LevelContentProps> = ({ protocol }) => {
  const isCompleted = useProtocolStore((state) => state.isCompleted(protocol.id));
  const markCompleted = useProtocolStore((state) => state.markCompleted);
  const markUncompleted = useProtocolStore((state) => state.markUncompleted);

  const [showCompletionNotice, setShowCompletionNotice] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [responseInput, setResponseInput] = useState("");

  // Initial conversation state with exact starting AI message: "Hello. The mission has started."
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-ai-msg",
      sender: "ai",
      text: "Hello. The mission has started.",
      timestamp: "SYSTEM // 00:00:01",
    },
  ]);

  const handleCompleteToggle = () => {
    if (isCompleted) {
      markUncompleted(protocol.id);
      setShowCompletionNotice(false);
    } else {
      markCompleted(protocol.id);
      setShowCompletionNotice(true);
    }
  };

  const handleSubmitResponse = () => {
    if (!responseInput.trim()) return;

    const newUserMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: "user",
      text: responseInput.trim(),
      timestamp: `USER // ${new Date().toLocaleTimeString()}`,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setResponseInput("");
  };

  return (
    <div className="relative w-full min-h-screen p-2 sm:p-4 font-mono text-[#E8E2D5] flex flex-col justify-between overflow-x-hidden">
      {/* UPLOADED APOCALYPTIC BACKGROUND IMAGE + THIN RED CRT TV STATIC & GLITCH EFFECT */}
      <LevelBackground />

      <div className="relative z-10 space-y-2 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between min-h-[calc(100vh-1rem)]">
        {/* COMPACT SECONDARY TOP CONTROL BAR (NAVIGATION, TITLE, TIMER & BRIEFING TOGGLE) */}
        <div className="space-y-1.5 w-full shrink-0">
          {/* Top Bar: Return Button, Title & Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0D0C0B]/80 backdrop-blur-xs px-3 py-1.5 rounded-sm border border-[#2E2923]/80 text-[10px] sm:text-xs">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1F1C18] hover:bg-[#8F241C] text-[#A49B91] hover:text-white border border-[#3D3730] hover:border-[#8F241C] font-bold uppercase tracking-wider transition-all duration-200"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>[ RETURN TO ARCHIVE ]</span>
              </Link>
              <h1 className="font-bold font-headline tracking-tight text-[#E8E2D5] uppercase text-xs sm:text-sm">
                {protocol.title} — {protocol.codename}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#1F1C18] border border-[#8F241C]/50 text-[#FFA8A0]">
                DIFFICULTY: {protocol.difficulty}
              </span>
              <span className="px-2 py-0.5 bg-[#1F1C18] border border-[#3D3730] text-[#A49B91]">
                SECTOR: {protocol.sector}
              </span>
              {isCompleted && (
                <span className="px-2 py-0.5 bg-[#8F241C]/40 border border-[#8F241C] text-[#FFA8A0] font-bold tracking-widest uppercase">
                  SEALED
                </span>
              )}
            </div>
          </div>

          {/* Compact Warrior vs Monster Timer Bar */}
          <LevelTimer initialMinutes={5} />

          {/* TRANSPARENT TYPEWRITER MISSION DOCUMENT DROPDOWN WITH BRIGHT WHITE TEXT */}
          <div className="border border-[#3D3730] bg-[#0D0C0B]/60 backdrop-blur-xs rounded-sm overflow-hidden text-[10px] font-mono shadow-xl">
            <button
              type="button"
              onClick={() => setShowBriefing(!showBriefing)}
              className="w-full px-3 py-1 bg-[#141210]/80 hover:bg-[#1A1715] text-left font-bold text-white hover:text-[#FFA8A0] flex items-center justify-between transition-colors border-b border-[#3D3730]"
            >
              <span className="tracking-wider">[ CLASSIFIED TYPEWRITER MISSION DOCUMENT &amp; DIRECTIVES ]</span>
              {showBriefing ? <ChevronUp className="w-3 h-3 text-white" /> : <ChevronDown className="w-3 h-3 text-white" />}
            </button>
            
            {showBriefing && (
              <div className="p-5 space-y-4 text-xs bg-transparent text-white font-mono border-t border-[#3D3730]">
                {/* Paper Typewriter Document Header */}
                <div className="flex flex-wrap items-baseline justify-between border-b border-[#3D3730] pb-2 font-mono gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    PROTOCOL {protocol.number}
                  </h2>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {protocol.sector} // DATE: {protocol.date}
                  </div>
                </div>

                {/* Main Typewriter Description Text */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs sm:text-sm font-mono font-medium text-white leading-relaxed tracking-wide whitespace-pre-wrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {protocol.description}
                  </p>
                </div>

                {/* Directives Memo */}
                {protocol.briefing.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-[#3D3730]">
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      DIRECTIVE MEMORANDUM:
                    </div>
                    {protocol.briefing.map((item, idx) => (
                      <p key={idx} className="text-xs text-white font-mono pl-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        • {item}
                      </p>
                    ))}
                  </div>
                )}

                {/* Typewriter Document Footer Stamp */}
                <div className="pt-2 border-t border-[#3D3730] flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <span>CLASSIFIED // EYES ONLY</span>
                  <span>CLEARANCE: {protocol.clearanceLevel}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DOMINANT MAIN ELEMENT: ENLARGED FULL-SCREEN CHAT TERMINAL (CRIMSON/RED ACCENTS) */}
        <div className="w-full flex-1 flex flex-col justify-between my-1">
          <HolographicPanel className="flex-1 flex flex-col h-full">
            <div className="space-y-4 flex flex-col flex-1 h-full min-h-[480px] sm:min-h-[580px] justify-between">
              {/* Terminal Status Header */}
              <div className="flex items-center justify-between border-b border-[#8F241C]/40 pb-2 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFA8A0] uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F241C] animate-pulse shadow-[0_0_8px_#8F241C]" />
                  <span>AI // MISSION AGENT</span>
                </div>
                <span className="text-[10px] text-[#A49B91] font-mono tracking-wider">
                  [ CRT MISSION TERMINAL ONLINE // CLEARANCE LEVEL: {protocol.clearanceLevel} ]
                </span>
              </div>

              {/* Chat Stream (Enlarged Dominant Viewport Area) */}
              <div className="space-y-4 flex-1 min-h-[340px] sm:min-h-[440px] overflow-y-auto pr-2 scrollbar-thin">
                {messages.map((msg) => (
                  <div key={msg.id} className="w-full">
                    {msg.sender === "ai" ? (
                      /* AI MESSAGE: Left Aligned Conversational Message */
                      <div className="space-y-1 max-w-[88%] text-left">
                        <div className="text-[10px] font-bold text-[#FFA8A0] uppercase tracking-widest flex items-center gap-2">
                          <span>&gt; AI // MISSION AGENT</span>
                        </div>
                        <div className="p-3.5 bg-[#141210]/95 border border-[#3D3730] border-l-2 border-l-[#8F241C] text-xs sm:text-sm text-[#E8E2D5] font-mono leading-relaxed whitespace-pre-wrap rounded-sm shadow-md">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      /* USER MESSAGE: Right Aligned Conversational Message */
                      <div className="w-full flex justify-end">
                        <div className="space-y-1 max-w-[88%] sm:max-w-[78%] text-right">
                          <div className="text-[10px] font-bold text-[#C45A22] uppercase tracking-widest">
                            &gt; USER
                          </div>
                          <div className="p-3.5 bg-[#1C1814]/95 border border-[#3D3730] border-r-2 border-r-[#C45A22] text-xs sm:text-sm text-[#E8E2D5] font-mono leading-relaxed whitespace-pre-wrap text-left rounded-sm shadow-md">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CHAT COMPOSER AT BOTTOM OF TERMINAL */}
              <div className="pt-2.5 border-t border-[#8F241C]/30 space-y-2 shrink-0">
                <div className="relative bg-[#141210]/95 border border-[#3D3730] focus-within:border-[#8F241C] transition-colors rounded-sm overflow-hidden shadow-inner">
                  <textarea
                    value={responseInput}
                    onChange={(e) => setResponseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitResponse();
                      }
                    }}
                    placeholder="Type your response..."
                    rows={3}
                    className="w-full p-3 bg-transparent text-[#E8E2D5] placeholder-[#665F55] font-mono text-xs sm:text-sm focus:outline-none resize-none pr-32"
                  />
                  <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSubmitResponse}
                      disabled={!responseInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8F241C] hover:bg-[#A82B21] disabled:bg-[#3D3730] text-white disabled:text-[#7A7266] font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg disabled:cursor-not-allowed border border-[#8F241C]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>[ SEND ]</span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[9px] text-[#7A7266] font-mono px-1">
                  <span>PROJECTED CRT TERMINAL MODEL: HOLO-v4.2</span>
                  <span>PRESS ENTER TO SEND, SHIFT+ENTER FOR NEW LINE</span>
                </div>
              </div>
            </div>
          </HolographicPanel>
        </div>

        {/* Compact Bottom Completion Bar */}
        <div className="py-2 px-3 border-t border-[#2E2923]/70 bg-[#0D0C0B]/80 backdrop-blur-xs rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs w-full shrink-0">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-[#E8E2D5] uppercase tracking-wider">
              STATUS: {isCompleted ? "MISSION COMPLETED" : "OPERATION IN PROGRESS"}
            </div>
            <p className="text-[9px] text-[#7A7266]">
              Marking complete applies the red wax seal stamp on the protocol document archive.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompleteToggle}
            className={`px-4 py-1.5 border font-mono font-bold text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg ${
              isCompleted
                ? "bg-[#8F241C] hover:bg-[#A82B21] text-[#FFFFFF] border-[#8F241C]"
                : "bg-[#1F1C18] hover:bg-[#2E2923] text-[#FFA8A0] border-[#3D3730] hover:border-[#8F241C]"
            }`}
          >
            {isCompleted ? "[ UNMARK COMPLETED ]" : "[ MARK PROTOCOL AS COMPLETED ]"}
          </button>
        </div>

        {/* Wax Seal Stamp Confirmation Notification */}
        {showCompletionNotice && isCompleted && (
          <div className="p-3 bg-[#1A1412] border-2 border-[#8F241C] flex items-center justify-between gap-3 animate-fade-in text-xs shrink-0">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#FFA8A0] uppercase">
                PROTOCOL {protocol.number} OFFICIALLY SEALED
              </h4>
              <p className="text-[10px] text-[#C5B5B0]">
                The red wax seal has been physically stamped on your mission protocol card in the main archive.
              </p>
            </div>
            <div className="shrink-0">
              <RedWaxSeal size={56} animate={true} text="SEALED" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
