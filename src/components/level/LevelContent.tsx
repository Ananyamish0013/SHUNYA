"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Protocol } from "@/lib/protocols";
import { useProtocolStore } from "@/stores/useProtocolStore";
import { RedWaxSeal } from "../protocols/RedWaxSeal";
import { ArrowLeft, Terminal, CheckCircle2, Send } from "lucide-react";

interface LevelContentProps {
  protocol: Protocol;
}

export const LevelContent: React.FC<LevelContentProps> = ({ protocol }) => {
  const isCompleted = useProtocolStore((state) => state.isCompleted(protocol.id));
  const markCompleted = useProtocolStore((state) => state.markCompleted);
  const markUncompleted = useProtocolStore((state) => state.markUncompleted);

  const [showCompletionNotice, setShowCompletionNotice] = useState(false);
  const [responseInput, setResponseInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});

  const toggleObjective = (index: number) => {
    setCheckedObjectives((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen space-y-8 p-6 sm:p-8 md:p-10 font-mono text-[#E8E2D5] flex flex-col justify-between">
      <div className="space-y-8 max-w-5xl mx-auto w-full">
        {/* Top Protocol Navigation & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#2E2923]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1C18] hover:bg-[#FFC928] text-[#A49B91] hover:text-[#0D0C0B] border border-[#3D3730] hover:border-[#FFC928] text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>[ RETURN TO ARCHIVE ]</span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 bg-[#1F1C18] border border-[#3D3730] text-[#FFC928]">
              DIFFICULTY: {protocol.difficulty}
            </span>
            <span className="px-3 py-1 bg-[#1F1C18] border border-[#3D3730] text-[#A49B91]">
              SECTOR: {protocol.sector}
            </span>
          </div>
        </div>

        {/* Chatbot Interface Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-2 border-b border-[#2E2923]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-[#E8E2D5] uppercase">
            {protocol.title} — {protocol.codename}
          </h1>
          {isCompleted && (
            <span className="px-3 py-1 bg-[#8F241C]/30 border border-[#8F241C] text-[#FFA8A0] text-xs font-bold tracking-widest uppercase">
              SEALED // COMPLETED
            </span>
          )}
        </div>

        {/* CHATBOT INTERFACE CONTAINER */}
        <div className="space-y-6 p-6 sm:p-8 bg-[#0F0E0D] border border-[#2E2923] rounded-sm shadow-2xl">
          {/* AI / MISSION AGENT Header Bar */}
          <div className="flex items-center justify-between border-b border-[#2A2520] pb-3">
            <span className="text-xs font-bold text-[#FFC928] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC928] animate-pulse" />
              AI / MISSION AGENT
            </span>
            <span className="text-[11px] text-[#7A7266] font-mono">
              [ TRANSMISSION ACTIVE // CLEARANCE: {protocol.clearanceLevel} ]
            </span>
          </div>

          {/* 1. STARTING AI MESSAGE AREA */}
          <div className="space-y-4 p-5 bg-[#141210] border border-[#3D3730] border-l-4 border-l-[#FFC928]">
            <div className="text-xs font-bold text-[#FFC928] uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>AI TRANSMISSION</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#E8E2D5] font-mono leading-relaxed">
              <p className="font-bold text-[#FFC928] bg-[#0D0C0B] p-3 border border-[#2E2923]">
                SYSTEM MESSAGE: Protocol initialized. Your mission is now active. Submit your response to proceed.
              </p>
              
              <p className="text-[#C2B9AC] leading-relaxed pt-1">
                {protocol.description}
              </p>

              {protocol.briefing.length > 0 && (
                <div className="space-y-1.5 text-xs text-[#A49B91] pt-1">
                  <span className="text-[#FFC928] text-[11px] uppercase font-bold block">
                    MISSION DIRECTIVES &amp; BRIEFING:
                  </span>
                  {protocol.briefing.map((item, idx) => (
                    <p key={idx}>• {item}</p>
                  ))}
                </div>
              )}

              {/* Objectives checklist integrated inside AI conversation */}
              {protocol.objectives.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[#FFC928] text-[11px] uppercase font-bold block">
                    TACTICAL OBJECTIVES:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {protocol.objectives.map((obj, i) => {
                      const isChecked = checkedObjectives[i] || isCompleted;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleObjective(i)}
                          className={`w-full text-left p-3 border transition-colors flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? "bg-[#1C1814] border-[#FFC928]/40 text-[#FFC928]"
                              : "bg-[#0D0C0B] border-[#2A2520] text-[#A49B91] hover:border-[#3D3730]"
                          }`}
                        >
                          <span className="text-xs font-mono">
                            [{i + 1}] {obj}
                          </span>
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0 ml-2" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#4A433A] shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. PARTICIPANT RESPONSE INPUT AREA */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#A49B91] uppercase tracking-widest">
              &gt; TYPE YOUR RESPONSE
            </label>
            <textarea
              value={responseInput}
              onChange={(e) => setResponseInput(e.target.value)}
              placeholder="Type your response..."
              rows={6}
              className="w-full p-4 bg-[#141210] border border-[#3D3730] focus:border-[#FFC928] text-[#E8E2D5] placeholder-[#665F55] font-mono text-xs sm:text-sm focus:outline-none transition-colors duration-200 resize-y"
            />
          </div>

          {/* 3. SEND / SUBMIT BUTTON & STATUS */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="text-[11px] text-[#7A7266] font-mono">
              {submitted ? "[ RESPONSE TRANSMITTED // PENDING SYSTEM VERIFICATION ]" : "[ READY FOR SUBMISSION ]"}
            </span>

            <button
              type="button"
              onClick={handleSubmitResponse}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC928] hover:bg-[#E0B020] text-[#0D0C0B] font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>[ SEND / SUBMIT ]</span>
            </button>
          </div>
        </div>

        {/* Completion Control Bar */}
        <div className="pt-6 border-t border-[#2E2923] flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#E8E2D5] uppercase tracking-wider">
              STATUS: {isCompleted ? "MISSION COMPLETED" : "OPERATION IN PROGRESS"}
            </div>
            <p className="text-[11px] text-[#7A7266]">
              Marking complete applies the red wax seal stamp on the protocol document archive.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompleteToggle}
            className={`px-6 py-3 border font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg ${
              isCompleted
                ? "bg-[#8F241C] hover:bg-[#A82B21] text-[#FFFFFF] border-[#8F241C]"
                : "bg-[#1F1C18] hover:bg-[#2E2923] text-[#FFC928] border-[#3D3730] hover:border-[#FFC928]"
            }`}
          >
            {isCompleted ? "[ UNMARK COMPLETED ]" : "[ MARK PROTOCOL AS COMPLETED ]"}
          </button>
        </div>

        {/* Wax Seal Stamp Confirmation Notification */}
        {showCompletionNotice && isCompleted && (
          <div className="p-6 bg-[#1A1412] border-2 border-[#8F241C] flex items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#FFA8A0] uppercase">
                PROTOCOL {protocol.number} OFFICIALLY SEALED
              </h4>
              <p className="text-xs text-[#C5B5B0]">
                The red wax seal has been physically stamped on your mission protocol card in the main archive.
              </p>
            </div>
            <div className="shrink-0">
              <RedWaxSeal size={72} animate={true} text="SEALED" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
