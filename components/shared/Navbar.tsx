"use client";

import { ChevronDown, Menu, X, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore, languages } from "@/stores/languageStore";
import { usersApi } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Practice",
    dropdown: [
      { href: "/practice/reading", label: "Reading Practice" },
      { href: "/practice/speaking", label: "Speaking Practice" },
      { href: "/practice/writing", label: "Writing Practice" },
      { href: "/practice/presentation", label: "Presentation Practice" },
      { href: "/practice/learn-english", label: "English for Adult Practice" },
    ],
  },
  { href: "/progress", label: "Progress" },
  { href: "/rewards", label: "Rewards" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact Us" },
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
  const handleLanguageSelect = async (languageCode: string) => {
    setLanguage(languageCode);
    setHoveredDropdown(null);

    if (isAuthenticated && user) {
      try {
        const langObj = languages.find((lang) => lang.code === languageCode);
        if (langObj) {
          const formData = new FormData();
          formData.append("firstName", user.firstName || "");
          formData.append("lastName", user.lastName || "");
          formData.append("hobbies", user.hobbies || "");
          formData.append("language", langObj.name);

          const result = await usersApi.updateProfile(formData);
          if (result.success && result.data) {
            useAuthStore.getState().setUser({
              ...user,
              language: result.data.language || langObj.name,
            });
          }
        }
      } catch (error) {
        console.error("Failed to update language on backend:", error);
      }
    }
  };

  // Check if a link or its dropdown items are active
  const isLinkActive = (link: (typeof navLinks)[0]) => {
    if (link.href && pathname === link.href) {
      return true;
    }
    if (link.dropdown) {
      return link.dropdown.some((item) => pathname === item.href);
    }
    return false;
  };

  // Check if a dropdown item is active
  const isDropdownItemActive = (href: string) => {
    return pathname === href;
  };

  const filteredNavLinks = navLinks.filter((link) => {
    if (
      !isAuthenticated &&
      (link.label === "Practice" ||
        link.label === "Progress" ||
        link.label === "Rewards")
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Desktop + Mobile Navbar */}
      <div className="fixed top-0 inset-x-0 z-50 backdrop-blur-md py-2">
        <div className="app-container flex items-center justify-between py-4">
          {/* Branding */}
          <Link href="/" className="text-center flex gap-2 items-center">
            <img
              src="/manifex-logo-02.png"
              alt="Manifex Logo"
              className="h-6 sm:h-8 mx-auto"
            />
            <h1 className="inline-block text-xl sm:text-2xl md:text-3xl font-bold uppercase text-gradient tracking-tight notranslate">
              Manifex
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 relative">
            {filteredNavLinks.map((link) => {
              const isDropdown = !!link.dropdown;
              const isActive = isLinkActive(link);

              return (
                <div
                  key={link.href || link.label}
                  className="relative"
                  onMouseEnter={() =>
                    isDropdown ? setHoveredDropdown(link.label) : null
                  }
                  onMouseLeave={() =>
                    isDropdown ? setHoveredDropdown(null) : null
                  }
                >
                  {isDropdown ? (
                    // For dropdown items, use button or span instead of Link
                    <button
                      className={clsx(
                        "flex items-center gap-1 text-base lg:text-lg xl:text-lg font-semibold transition-colors hover:text-white whitespace-nowrap",
                        isActive ? "text-gradient" : "text-gray-300",
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={clsx(
                          "w-4 h-4 lg:w-5 lg:h-5 font-bold transition-transform",
                          hoveredDropdown === link.label ? "rotate-180" : "",
                        )}
                      />
                    </button>
                  ) : (
                    // For regular links, use Link component
                    <Link
                      href={link.href!}
                      className={clsx(
                        "flex items-center gap-1 text-base lg:text-lg xl:text-lg font-semibold transition-colors hover:text-white whitespace-nowrap",
                        isActive ? "text-gradient" : "text-gray-300",
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Invisible buffer to avoid flicker */}
                  {isDropdown && hoveredDropdown === link.label && (
                    <div className="absolute left-0 top-full w-full h-3 bg-transparent"></div>
                  )}

                  {/* Dropdown Menu */}
                  {isDropdown && hoveredDropdown === link.label && (
                    <div className="absolute top-[calc(100%+0.5rem)] left-0 w-56 lg:w-60 bg-gradient-to-br from-[#28284A] via-[#28284A] to-[#12122A] border border-gray-700 rounded-lg shadow-lg flex flex-col px-4 z-50">
                      {link.dropdown.map((item) => {
                        const isItemActive = isDropdownItemActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                              "py-3 lg:py-4 text-sm lg:text-base font-medium tracking-wide transition-colors border-b-[1px] border-gray-700 last:border-b-0",
                              isItemActive
                                ? "text-gradient"
                                : "text-gray-300 hover:text-white",
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {isAuthenticated && user ? (
              <Link href="/profile" className="flex items-center">
                <div className="relative w-10 h-10 lg:w-12 lg:h-12">
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
              <Link
                href="/signin"
                className="text-gray-300 text-base lg:text-lg font-semibold hover:text-white whitespace-nowrap"
              >
                Login
              </Link>
            )}

            {/* Language Switcher Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredDropdown("language")}
              onMouseLeave={() => setHoveredDropdown(null)}
            >
              <button className="relative inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-3 text-base lg:text-lg font-semibold text-white bg-transparent rounded-2xl">
                <Globe className="w-4 h-4 lg:w-5 lg:h-5 z-10" />
                <span className="z-10 whitespace-nowrap">
                  {isMounted ? currentLanguageName : "English"}
                </span>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 lg:w-5 lg:h-5 z-10 transition-transform",
                    hoveredDropdown === "language" ? "rotate-180" : "",
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
                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-48 lg:w-56 bg-gradient-to-br from-[#28284A] via-[#28284A] to-[#12122A] border border-gray-700 rounded-xl shadow-lg flex flex-col py-2 px-2 z-50 notranslate">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className="flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-semibold tracking-wide rounded-lg text-left"
                    >
                      <div>
                        <div className="font-semibold text-xs lg:text-sm">
                          {language.name}
                        </div>
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
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white"
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
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col min-h-full p-6">
          {/* Top: Branding + Close */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-center flex gap-2 items-center">
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
            {filteredNavLinks.map((link) => {
              const isDropdown = !!link.dropdown;
              const isActive = isLinkActive(link);

              if (isDropdown) {
                return (
                  <div key={link.label} className="flex flex-col">
                    <button
                      className={clsx(
                        "flex justify-between items-center text-lg font-semibold text-gray-300 hover:text-white py-2 transition-colors",
                        isActive && "text-gradient",
                      )}
                      onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    >
                      {link.label}
                      <ChevronDown
                        className={clsx(
                          "w-5 h-5 transition-transform",
                          mobileDropdownOpen ? "rotate-180" : "",
                        )}
                      />
                    </button>

                    {/* Dropdown (mobile) */}
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        mobileDropdownOpen
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0",
                      )}
                    >
                      <div className="flex flex-col pl-4 mt-1 border-l-2 border-gray-700">
                        {link.dropdown.map((item) => {
                          const isItemActive = isDropdownItemActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={clsx(
                                "py-2 text-base font-semibold tracking-wide transition-colors",
                                isItemActive
                                  ? "text-gradient"
                                  : "text-gray-300 hover:text-white",
                              )}
                              onClick={() => {
                                setSidebarOpen(false);
                                setMobileDropdownOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={clsx(
                    "text-lg font-semibold hover:text-white py-2 transition-colors",
                    isActive ? "text-gradient" : "text-gray-300",
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
                      : "text-gray-300 border-gray-600 hover:bg-white/5 hover:text-white",
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
