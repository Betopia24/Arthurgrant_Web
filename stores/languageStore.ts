import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
    preferredLang: string;
    setLanguage: (languageCode: string) => void;
    getCurrentLanguageName: () => string;
    initializeGoogleTranslate: () => void;
    hasSelectedLanguage: boolean;
}

export const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "zh-CN", name: "Chinese", nativeName: "中文" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
];

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            preferredLang: "en",
            hasSelectedLanguage: false,

            setLanguage: (languageCode: string) => {
                const currentState = get();
                
                // Only update if language is actually changing
                if (currentState.preferredLang !== languageCode || !currentState.hasSelectedLanguage) {
                    set({ 
                        preferredLang: languageCode,
                        hasSelectedLanguage: true 
                    });

                    // Set Google Translate cookies
                    if (typeof window !== 'undefined') {
                        document.cookie = `googtrans=/en/${languageCode}; path=/; max-age=31536000`;
                        document.cookie = `googtrans=/en/${languageCode}; path=/; domain=.${window.location.hostname}; max-age=31536000`;

                        // Force Google Translate to update
                        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                            new window.google.translate.TranslateElement({
                                pageLanguage: 'en',
                                includedLanguages: 'en,fr,es,hi,bn,zh-CN,ko,ru,vi,it,de',
                                autoDisplay: false,
                            }, 'google_translate_element');

                            // Change the language in Google Translate
                            setTimeout(() => {
                                const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                                if (select && select.value !== languageCode) {
                                    select.value = languageCode;
                                    select.dispatchEvent(new Event('change'));
                                }
                            }, 1000);
                        }

                        // Reload the page for Google Translate to pick up the change
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                }
            },

            getCurrentLanguageName: () => {
                const state = get();
                const language = languages.find((lang) => lang.code === state.preferredLang);
                return language?.name || "English";
            },

            initializeGoogleTranslate: () => {
                if (typeof window === 'undefined') return;

                const { preferredLang } = get();

                // Ensure Google Translate cookies match our store
                if (preferredLang !== 'en') {
                    document.cookie = `googtrans=/en/${preferredLang}; path=/; max-age=31536000`;
                    document.cookie = `googtrans=/en/${preferredLang}; path=/; domain=.${window.location.hostname}; max-age=31536000`;
                }

                // Apply language to Google Translate after it loads
                const applyLanguageToGoogleTranslate = () => {
                    if (preferredLang !== 'en') {
                        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                        if (select && select.value !== preferredLang) {
                            select.value = preferredLang;
                            select.dispatchEvent(new Event('change'));
                        }
                    }
                };

                // Try to apply language multiple times as Google Translate loads
                setTimeout(applyLanguageToGoogleTranslate, 1000);
                setTimeout(applyLanguageToGoogleTranslate, 3000);
                setTimeout(applyLanguageToGoogleTranslate, 5000);
            }
        }),
        {
            name: 'language-storage',
        }
    )
);