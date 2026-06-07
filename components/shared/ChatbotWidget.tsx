"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquareText, X, Send, Bot, Loader2 } from "lucide-react";
import { useSendChatbotMessageMutation } from "@/redux/features/chatbot/chatbotApi";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! Welcome to MANIFEX Support. I am your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [sendMessage, { isLoading }] = useSendChatbotMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat list
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setInputValue("");

    // Append user message immediately
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, timestamp: new Date() },
    ]);

    try {
      const response = await sendMessage({
        message: userMsg,
      }).unwrap();

      if (response?.chatbot_reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: response.chatbot_reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error("No response message received.");
      }
    } catch (err) {
      console.error("Chatbot response error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm sorry, I'm experiencing technical difficulties right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-2xl border border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer hover:shadow-glow"
        title="Chat with Support"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <MessageSquareText className="w-6 h-6" />
        )}
      </button>

      {/* Chat window panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-6 z-50 w-[350px] sm:w-[380px] h-[480px] bg-[#12132F] border border-gray-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-dark to-brand-darker border-b border-gray-700/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  MANIFEX Support
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    AI Agent • Online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0a0a1a]/50 scrollbar-thin scrollbar-thumb-gray-800 animate-in">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user"
                    ? "self-end ml-auto justify-end animate-in fade-in duration-200"
                    : "items-start animate-in fade-in duration-200"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#2B2E4E]/80 border border-gray-700 flex items-center justify-center text-[#FFBC6F] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`px-3.5 py-2 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-brand text-white rounded-tr-none"
                      : "bg-[#2B2E4E]/80 text-white rounded-tl-none border border-gray-700/40"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] items-start">
                <div className="w-7 h-7 rounded-full bg-[#2B2E4E]/80 border border-gray-700 flex items-center justify-center text-[#FFBC6F] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 py-3 px-4 bg-[#2B2E4E]/80 border border-gray-700/40 text-white rounded-2xl rounded-tl-none">
                  <span
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#0d0e23] border-t border-gray-700/50 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Ask anything about platform..."
              className="flex-1 input-style py-2 px-3 text-sm h-10 border border-gray-700/50 focus:border-[#FFBC6F]/40 placeholder:text-gray-500 rounded-xl"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white active:scale-95 transition-transform hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
;
