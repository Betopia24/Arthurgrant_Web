import React from "react";

const Footer = () => {
  return (
    <footer className="py-20 bg-section-dark text-white">
      <div className="app-container flex flex-col items-center gap-12">
        {/* Top Section: Brand + Contact + Social */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-12">
          {/* Brand */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex justify-center md:justify-start gap-2 mb-2">
              <img
                src="/manifex-logo-02.png"
                alt="Manifex Logo"
                className="h-8 mx-auto"
              />
              <h2 className="text-2xl font-bold text-gradient notranslate">
                MANIFEX
              </h2>
            </div>
            <p className="text-gray-300 max-w-xs">
              AI-powered English learning designed for dyslexia and global
              learners. Transform your communication skills with personalized,
              engaging lessons.
            </p>
          </div>

          {/* Contact Info + Social */}
          <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right gap-2">
            <p className="text-gray-300">info@DFTJunkei.com</p>
            <p className="text-gray-300">Whatsapp: +8899036154</p>
            <div className="flex gap-4 mt-2 justify-center md:justify-end">
              <a href="#">
                <img src="/facebook.png" alt="Facebook" className="w-7 h-7" />
              </a>
              <a href="#">
                <img src="/x.png" alt="X" className="w-6 h-6 mt-0.5" />
              </a>
              <a href="#">
                <img src="/instagram.png" alt="Instagram" className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Navbar Row */}
        <div className="w-full border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <p>© {new Date().getFullYear()} - All rights Reserved</p>
          <div className="flex gap-6">
            <a href="/terms" className="hover:underline">
              Terms of Use
            </a>
            <a href="/policy" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
