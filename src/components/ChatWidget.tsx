import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, Check, Sparkles, User } from "lucide-react";
import { ChatMessage } from "../types";

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hi there! I'm Mike's Plumbing virtual assistant. We specialize in fast, friendly service here in the local area. How can I help you book or answer your questions today?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const starterChips = [
    "What services do you offer?",
    "Can I book an appointment?",
    "What are your prices?",
  ];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleChipClick = (text: string) => {
    if (isStreaming) return;
    sendMessage(text);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsStreaming(true);
    setStreamingText("");

    // Prepare history for API (sending context)
    const historyPayload = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamAccumulator = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value);
        const lines = chunkStr.split("\n");

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith("data: ")) {
            const dataStr = cleanLine.slice(6).trim();

            if (dataStr === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                streamAccumulator += parsed.text;
                setStreamingText(streamAccumulator);
              }
            } catch (err) {
              // Ignore single partial parses
            }
          }
        }
      }

      // Finish streaming and append message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: streamAccumulator || "Can I schedule a quick phone call to discuss your plumbing needs?",
        },
      ]);
      setStreamingText("");
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "Thanks for your inquiry! Our dispatcher can reach you quickly at your convenience. Could you share your phone number so we can book this for you?",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputVal);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-semibold mb-2 flex items-center gap-1.5 uppercase">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DBA6F] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DBA6F]"></span>
        </span>
        ⚡ LIVE DEMO — This is what your customers experience
      </div>

      {/* Widget Body */}
      <div className="bg-gradient-to-b from-[#101010] to-[#080808] border border-[rgba(201,168,76,0.18)] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white/3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
              <Bot size={18} />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-xs tracking-wide text-white leading-tight">
                Mike's Plumbing Assistant
              </h4>
              <p className="font-mono text-[9px] text-[#3DBA6F] flex items-center gap-1.5 leading-none mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3DBA6F] animate-pulse"></span>
                ACTIVE RECEPTIONIST (AI)
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#3DBA6F]/10 border border-[#3DBA6F]/20 font-mono text-[8.5px] font-semibold text-[#3DBA6F] tracking-wide uppercase">
            Online
          </div>
        </div>

        {/* Scrollable chat body */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3.5"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role !== "user" && (
                <div className="w-7 h-7 shrink-0 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] text-[10px]">
                  <Bot size={13} />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-xs font-sans leading-relaxed transition-all duration-200 ${
                  msg.role === "user"
                    ? "bg-[#C9A84C] text-black font-medium rounded-tr-none"
                    : "bg-white/5 border border-white/5 text-stone-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 shrink-0 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] text-[10px]">
                  <User size={13} />
                </div>
              )}
            </div>
          ))}

          {/* Incoming Streaming chunk message */}
          {isStreaming && streamingText && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 shrink-0 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                <Bot size={13} />
              </div>
              <div className="max-w-[85%] bg-white/5 border border-white/5 text-stone-200 rounded-lg rounded-tl-none px-3.5 py-2.5 text-xs font-sans leading-relaxed">
                {streamingText}
                <span className="inline-block w-1.5 h-3 ml-1 bg-[#C9A84C] animate-pulse"></span>
              </div>
            </div>
          )}

          {/* Typing Indicator if fetching block is silent */}
          {isStreaming && !streamingText && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 shrink-0 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                <Bot size={13} />
              </div>
              <div className="bg-white/5 border border-white/5 text-stone-400 rounded-lg rounded-tl-none px-3.5 py-2.5 text-xs font-mono tracking-wide flex items-center gap-1.5">
                Connecting dispatcher
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-[#C9A84C] rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-[#C9A84C] rounded-full animate-bounce delay-100"></span>
                  <span className="w-1 h-1 bg-[#C9A84C] rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chips Footer */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/3 flex flex-wrap gap-1.5">
          {starterChips.map((chip, index) => (
            <button
              key={index}
              onClick={() => handleChipClick(chip)}
              disabled={isStreaming}
              className="text-[10px] font-sans font-medium px-2.5 py-1 rounded bg-[#C9A84C]/5 border border-[#C9A84C]/15 text-[#C9A84C] hover:bg-[#C9A84C]/20 hover:text-[#F0C060] transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Form Input */}
        <div className="p-3 bg-white/3 border-t border-white/5 flex gap-2">
          <input
            id="chat-input"
            type="text"
            placeholder="Type a service question or book..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isStreaming}
            className="flex-1 bg-black border border-white/10 rounded px-3 py-2 text-xs font-sans text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-[#C9A84C]/50 disabled:opacity-60"
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage(inputVal)}
            disabled={isStreaming || !inputVal.trim()}
            className="p-2 rounded bg-[#C9A84C] hover:bg-[#F0C060] active:scale-95 text-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
          </button>
        </div>

        {/* Powered by badge */}
        <div className="px-4 py-1.5 bg-black border-t border-white/5 flex items-center justify-between text-[8px] font-mono tracking-widest text-stone-500 uppercase select-none">
          <span className="flex items-center gap-1">
            <Sparkles size={8} className="text-[#C9A84C]" />
            CONVERSION INFRASTRUCTURE V2.1
          </span>
          <span className="text-[#C9A84C]/80 font-bold">Powered by NovuWebs.AI</span>
        </div>
      </div>
    </div>
  );
}
