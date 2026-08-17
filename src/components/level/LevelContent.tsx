"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Protocol } from "@/lib/protocols";
import { useProtocolStore } from "@/stores/useProtocolStore";
import { RedWaxSeal } from "../protocols/RedWaxSeal";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";

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
  const [responseInput, setResponseInput] = useState("");
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});

  // Initial conversation state with starting AI message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-ai-msg",
      sender: "ai",
      text: `Your next objective for ${protocol.title} (${protocol.codename}) has been initialized.\n\n${protocol.description}`,
      timestamp: "SYSTEM // 00:00:01",
    },
  ]);

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
    <div className="w-full min-h-screen space-y-6 p-6 sm:p-8 md:p-10 font-mono text-[#E8E2D5] flex flex-col justify-between">
      <div className="space-y-6 max-w-5xl mx-auto w-full">
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

        {/* Level Header Title */}
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

        {/* CONVERSATION CONTAINER */}
        <div className="space-y-6 p-6 sm:p-8 bg-[#0F0E0D] border border-[#2E2923] rounded-sm shadow-2xl">
          {/* Messages Stream */}
          <div className="space-y-6 min-h-[300px] flex flex-col justify-start">
            {messages.map((msg, index) => (
              <div key={msg.id} className="w-full">
                {msg.sender === "ai" ? (
                  /* PLAIN TEXT AI MESSAGE (NO BOX, NO BORDERS, NO CARDS, NO HEADER BARS) */
                  <div className="space-y-4 text-xs sm:text-sm text-[#E8E2D5] font-mono leading-relaxed max-w-full">
                    <p className="font-normal text-[#E8E2D5] leading-relaxed">
                      Your next objective for {protocol.title} ({protocol.codename}) has been initialized.
                    </p>

                    <p className="text-[#C2B9AC] leading-relaxed">
                      {protocol.description}
                    </p>

                    {index === 0 && protocol.briefing.length > 0 && (
                      <div className="space-y-1.5 text-xs text-[#A49B91] pt-2">
                        <span className="text-[#FFC928] text-[11px] uppercase font-bold block">
                          MISSION DIRECTIVES &amp; BRIEFING:
                        </span>
                        {protocol.briefing.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    )}

                    {index === 0 && protocol.objectives.length > 0 && (
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
                                className={`w-full text-left py-2 px-3 transition-colors flex items-center justify-between cursor-pointer ${
                                  isChecked
                                    ? "text-[#FFC928]"
                                    : "text-[#A49B91] hover:text-[#E8E2D5]"
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
                ) : (
                  /* SUBMITTED USER MESSAGE */
                  <div className="w-full flex justify-end">
                    <div className="space-y-2 p-4 rounded-sm bg-[#1C1814] border border-[#3D3730] border-r-4 border-r-[#C45A22] text-left ml-auto max-w-[85%] sm:max-w-[75%]">
                      <div className="text-[10px] text-[#C45A22] font-bold uppercase tracking-widest">
                        USER // OPERATOR
                      </div>
                      <div className="text-xs sm:text-sm text-[#E8E2D5] font-mono leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CHAT COMPOSER AT BOTTOM */}
          <div className="pt-4 border-t border-[#2E2923] space-y-3">
            <div className="relative bg-[#141210] border border-[#3D3730] focus-within:border-[#FFC928] transition-colors rounded-sm overflow-hidden">
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
                className="w-full p-4 bg-transparent text-[#E8E2D5] placeholder-[#665F55] font-mono text-xs sm:text-sm focus:outline-none resize-none pr-32"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitResponse}
                  disabled={!responseInput.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFC928] hover:bg-[#E0B020] disabled:bg-[#3D3730] text-[#0D0C0B] disabled:text-[#7A7266] font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>[ SEND ]</span>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#7A7266] font-mono px-1">
              <span>SYSTEM MODEL: ZERO-DAY-MISSION-AI-v4.2</span>
              <span>PRESS ENTER TO SEND, SHIFT+ENTER FOR NEW LINE</span>
            </div>
          </div>
        </div>

        {/* Completion Control Bar */}
        <div className="pt-4 border-t border-[#2E2923] flex flex-wrap items-center justify-between gap-6">
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
