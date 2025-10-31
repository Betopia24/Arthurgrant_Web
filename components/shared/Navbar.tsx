"use client";

import { ChevronDown, Menu, X, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore, languages } from "@/stores/languageStore";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/practice",
    label: "Practice",
    dropdown: [
      { href: "/practice/speaking", label: "Speaking" },
      { href: "/practice/listening", label: "Listening" },
      { href: "/practice/writing", label: "Writing" },
      { href: "/practice/presentation", label: "Presentation" },
      { href: "/practice/learn-english", label: "Learn English With Us" },
    ],
  },
  { href: "/progress", label: "Progress" },
  { href: "/rewards", label: "Rewards" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { preferredLang, setLanguage, getCurrentLanguageName } =
    useLanguageStore();

  // State for hydration-safe language name
  const [currentLanguageName, setCurrentLanguageName] = useState("English");
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    setCurrentLanguageName(getCurrentLanguageName());
  }, [getCurrentLanguageName]);

  // Close sidebar & dropdown on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setHoveredDropdown(null);
        setMobileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Close sidebar when screen size becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Language selection handler
  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode);
    setHoveredDropdown(null);
  };

  return (
    <>
      {/* Desktop + Mobile Navbar */}
      <div className="fixed top-0 inset-x-0 z-50 backdrop-blur-md py-2">
        <div className="app-container flex items-center justify-between py-4">
          {/* Branding */}
          <Link href="/" className="text-center flex gap-2">
            <img
              src="/manifex-logo-02.png"
              alt="Manifex Logo"
              className="h-8 mx-auto"
            />
            <h1 className="inline-block text-2xl sm:text-3xl font-bold uppercase text-gradient tracking-tight notranslate">
              Manifex
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 relative">
            {navLinks.map((link) => {
              const isDropdown = !!link.dropdown;
              const isActive = pathname === link.href;

              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() =>
                    isDropdown ? setHoveredDropdown(link.href) : null
                  }
                  onMouseLeave={() =>
                    isDropdown ? setHoveredDropdown(null) : null
                  }
                >
                  <Link
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-1 text-base md:text-lg font-semibold transition-colors hover:text-white",
                      isActive ? "text-gradient" : "text-gray-300"
                    )}
                  >
                    {link.label}
                    {isDropdown && (
                      <ChevronDown
                        className={clsx(
                          "w-6 h-6 font-bold transition-transform",
                          hoveredDropdown === link.href ? "rotate-180" : ""
                        )}
                      />
                    )}
                  </Link>

                  {/* Invisible buffer to avoid flicker */}
                  {isDropdown && hoveredDropdown === link.href && (
                    <div className="absolute left-0 top-full w-full h-3 bg-transparent"></div>
                  )}

                  {/* Dropdown Menu */}
                  {isDropdown && hoveredDropdown === link.href && (
                    <div className="absolute top-[calc(100%+0.5rem)] left-0 w-56 bg-gradient-to-br from-[#28284A] via-[#28284A] to-[#12122A] border border-gray-700 rounded-xl shadow-lg flex flex-col py-2 px-2 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-semibold tracking-wide rounded-lg"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-10">
            {isAuthenticated && user ? (
              <Link href="/profile" className="flex items-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to p-0.5">
                    <div className="bg-black rounded-full w-full h-full overflow-hidden">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-gray-300 text-base md:text-lg font-semibold hover:text-white"
                >
                  Login
                </Link>

                {/* Language Switcher Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredDropdown("language")}
                  onMouseLeave={() => setHoveredDropdown(null)}
                >
                  <button className="relative inline-flex items-center gap-2 px-5 py-3 text-base md:text-lg font-semibold text-white bg-transparent rounded-2xl">
                    <Globe className="w-5 h-5 z-10" />
                    <span className="z-10">
                      {isMounted ? currentLanguageName : "English"}
                    </span>
                    <ChevronDown
                      className={clsx(
                        "w-5 h-5 z-10 transition-transform",
                        hoveredDropdown === "language" ? "rotate-180" : ""
                      )}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none border-[2px]"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 0 100%)",
                        borderColor: "#9CA3AF",
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none border-[2px]"
                      style={{
                        clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
                        borderColor: "#4B5563",
                      }}
                    />
                  </button>

                  {/* Invisible buffer to avoid flicker */}
                  {hoveredDropdown === "language" && (
                    <div className="absolute left-0 top-full w-full h-3 bg-transparent"></div>
                  )}

                  {/* Language Dropdown Menu */}
                  {hoveredDropdown === "language" && (
                    <div className="absolute top-[calc(100%+0.5rem)] right-0 w-56 bg-gradient-to-br from-[#28284A] via-[#28284A] to-[#12122A] border border-gray-700 rounded-xl shadow-lg flex flex-col py-2 px-2 z-50 notranslate">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageSelect(language.code)}
                          className="flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-semibold tracking-wide rounded-lg text-left"
                        >
                          <div>
                            <div className="font-semibold">{language.name}</div>
                            <div className="text-xs text-gray-400">
                              {language.nativeName}
                            </div>
                          </div>
                          {preferredLang === language.code && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Panel */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full z-50 w-4/5 max-w-xs bg-gradient-to-br from-brand-dark to-brand-darker transform transition-transform duration-300 overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col min-h-full p-6">
          {/* Top: Branding + Close */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-center flex gap-2">
              <img
                src="/manifex-logo-02.png"
                alt="Manifex Logo"
                className="h-6 mx-auto"
              />
              <h1 className="text-xl font-bold uppercase text-gradient tracking-tight notranslate">
                Manifex
              </h1>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 mb-8">
            {navLinks.map((link) => {
              const isDropdown = !!link.dropdown;
              const isActive = pathname === link.href;

              if (isDropdown) {
                return (
                  <div key={link.href} className="flex flex-col">
                    <button
                      className={clsx(
                        "flex justify-between items-center text-lg font-semibold text-gray-300 hover:text-white py-2 transition-colors",
                        isActive && "text-gradient"
                      )}
                      onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    >
                      {link.label}
                      <ChevronDown
                        className={clsx(
                          "w-5 h-5 transition-transform",
                          mobileDropdownOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {/* Dropdown (mobile) */}
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        mobileDropdownOpen
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="flex flex-col pl-4 mt-1 border-l-2 border-gray-700">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="py-2 text-gray-300 hover:text-white text-base font-semibold tracking-wide"
                            onClick={() => {
                              setSidebarOpen(false);
                              setMobileDropdownOpen(false);
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "text-lg font-semibold hover:text-white py-2 transition-colors",
                    pathname === link.href ? "text-gradient" : "text-gray-300"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher for Mobile */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">
              Language
            </h3>
            <div className="grid grid-cols-2 gap-2 notranslate">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    handleLanguageSelect(language.code);
                    setSidebarOpen(false);
                  }}
                  className={clsx(
                    "p-2 text-sm font-semibold rounded-lg border transition-colors text-left",
                    preferredLang === language.code
                      ? "bg-white/10 text-white border-blue-500"
                      : "text-gray-300 border-gray-600 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="font-semibold">{language.name}</div>
                  <div className="text-xs text-gray-400">
                    {language.nativeName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-auto pt-6">
            {isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to p-0.5">
                    <div className="bg-black rounded-full w-full h-full overflow-hidden">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-gray-300 text-xs">View Profile</span>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-gray-300 text-lg font-semibold hover:text-white text-center py-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
