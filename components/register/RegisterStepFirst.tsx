"use client";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useLanguageStore, languages } from "@/stores/languageStore";

interface RegisterStepFirstProps {
  data: {
    selectedLanguage: string;
  };
  updateData: (data: { selectedLanguage: string }) => void;
  nextStep: () => void;
}

const RegisterStepFirst = ({
  data,
  updateData,
  nextStep,
}: RegisterStepFirstProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    data.selectedLanguage,
  );
  const { preferredLang, setLanguage, getCurrentLanguageName } =
    useLanguageStore();
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration - run only once on mount
  useEffect(() => {
    setIsMounted(true);

    // Only initialize if we don't have a selected language yet
    if (!data.selectedLanguage || data.selectedLanguage === "English") {
      const currentLangName = getCurrentLanguageName();
      setSelectedLanguage(currentLangName);
      updateData({ selectedLanguage: currentLangName });
    }
  }, []); // Empty dependency array - run only once on mount

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedLanguageName = e.target.value;
    setSelectedLanguage(selectedLanguageName);
    updateData({ selectedLanguage: selectedLanguageName });

    // Find the language code and update the language store
    const selectedLang = languages.find(
      (lang) => lang.name === selectedLanguageName,
    );
    if (selectedLang) {
      setLanguage(selectedLang.code);
      // No need to call updateData again here - setLanguage will trigger page reload
    }
  };

  const handleNext = () => {
    if (selectedLanguage) {
      nextStep();
    }
  };

  // Get current language name for display (hydration-safe)
  const currentLanguageName = isMounted ? getCurrentLanguageName() : "English";

  return (
    <div className="w-full min-h-screen bg-[#05061E] flex items-center justify-center px-4 notranslate">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <div className="text-center">
            <h1 className="inline-block text-3xl sm:text-4xl md:text-5xl font-bold uppercase bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-transparent bg-clip-text">
              Manifex
            </h1>
          </div>

          <p className="text-center text-lg text-gray-300">
            Welcome to Manifex! Let’s Start your learning journey today!
          </p>
        </div>

        <div>
          {/* Image with Blur Background Effect */}
          <div className="flex justify-center mb-10 relative">
            {/* Background Blur */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-t from-[#05061E] via-[#2C3E50] to-transparent blur-sm opacity-40"></div>

            {/* Image */}
            <div className="relative w-[350px] h-[350px] rounded-full overflow-hidden">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center flex-col gap-2">
            <h1 className="text-white text-xl font-semibold">
              Please select your language
            </h1>

            {/* Language Selector - Now using the actual language store languages */}
            <div>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="w-full bg-[#24263A] border border-gray-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F176B7] mt-2 notranslate"
              >
                <option value="" disabled>
                  Select a language
                </option>
                {languages.map((language) => (
                  <option key={language.code} value={language.name}>
                    {language.name} ({language.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Show current selected language for confirmation */}
            <p className="text-gray-400 text-sm mt-2">
              Current: {currentLanguageName}
            </p>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedLanguage}
          className="w-full mt-10 py-2 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RegisterStepFirst;
