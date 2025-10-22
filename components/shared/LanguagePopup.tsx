"use client";

import { useState, useEffect } from "react";
import { X, Globe } from "lucide-react";

interface LanguagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (languageCode: string) => void;
}

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "zh-CN", name: "Chinese", nativeName: "中文" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "de", name: "German", nativeName: "Deutsch" },
];

export default function LanguagePopup({
  isOpen,
  onClose,
  onLanguageSelect,
}: LanguagePopupProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleConfirm = () => {
    onLanguageSelect(selectedLanguage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Select Language
              </h2>
              <p className="text-sm text-gray-600">
                Choose your preferred language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Language List */}
        <div className="max-h-96 overflow-y-auto p-6">
          <div className="space-y-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedLanguage === language.code
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {language.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language.nativeName}
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-brand-btn text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Confirm Language
          </button>
        </div>
      </div>
    </div>
  );
}
