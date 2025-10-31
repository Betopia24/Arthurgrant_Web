'use client';

import React, { useState } from "react";
import Heading from "../shared/Heading";
import { faq } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-brand-darker">
      <div className="app-container flex flex-col items-center gap-16">
        {/* Heading */}
        <Heading
          heading="Frequently Asked Questions"
          subheading="Everything you need to know about MANIFEX Education"
          specialText="Questions"
          align="center"
        />

        <div className="w-full max-w-4xl flex flex-col gap-4">
          {faq.map((item, index) => (
            <div
              key={index}
              className={`p-2 bg-gradient-to-br from-[#2B2E4E] to-brand-darker rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                openIndex === index ? "border border-gray-500" : "border-2 border-transparent"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center text-white font-semibold transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                <span className={`text-xl transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                  <ChevronDown />
                </span>
              </button>

              <div
                className={`px-6 overflow-hidden text-gray-300 transition-[max-height] duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 py-4" : "max-h-0 py-0"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
