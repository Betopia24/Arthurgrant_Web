import React from "react";
import Image from "next/image";
import Heading from "../shared/Heading";

const DownloadApp = () => {
  const appleAppStoreUrl = "https://apps.apple.com/us/app/manifex/id6759362792";
  const googlePlayStoreUrl = "https://play.google.com/store/apps/details?id=com.manifex.app";

  return (
    <div className="py-20 bg-gradient-to-br from-[#05051E] via-[#101231] to-[#05051E] relative overflow-hidden">
      {/* Background decorative glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      <div className="app-container flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left Side: Mockup or Graphic */}
        <div className="flex-1 w-full flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[320px] aspect-[9/18.5] rounded-[40px] border-4 border-gray-800 bg-[#0d0e22] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
            {/* Screen Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-black rounded-full mb-1" />
            </div>

            {/* In-app mockup preview */}
            <div className="flex-1 flex flex-col justify-between pt-8 pb-4 px-4 bg-gradient-to-b from-[#12132F] to-[#05061E] rounded-[32px] overflow-hidden relative">
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <Image
                    src="/manifex-logo-02.png"
                    alt="Manifex Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span className="font-extrabold text-[11px] text-gradient uppercase">Manifex</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[8px] font-semibold">
                  Live
                </div>
              </div>

              {/* Center App Icon Mockup */}
              <div className="my-auto flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <Image
                    src="/app-logo.png"
                    alt="Manifex App Store Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-wide uppercase">MANIFEX</h3>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[160px] mx-auto leading-normal">
                    AI English learning in your pocket
                  </p>
                </div>
              </div>

              {/* Bottom mockup layout */}
              <div className="space-y-3 bg-[#1e203f]/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-2 bg-white/70 rounded-full" />
                  <div className="w-6 h-1 bg-white/40 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-6 bg-[#35364E] rounded-lg animate-pulse" />
                  <div className="h-6 bg-[#35364E] rounded-lg" />
                  <div className="h-6 bg-[#35364E] rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Copy & Store Buttons */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-xl">
          <Heading
            heading="Learn English Anywhere, Anytime"
            subheading="Download the Manifex mobile app to practice reading, writing, and speaking on the go. Complete daily tasks and unlock reward videos right from your pocket."
            specialText="Anywhere, Anytime"
            align="left"
          />

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
            {/* App Store Button */}
            <a
              href={appleAppStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-black hover:bg-gray-900 border border-white/10 rounded-2xl transition duration-200 shadow-xl group cursor-pointer w-[180px] justify-center"
            >
              {/* Apple SVG Icon */}
              <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[10px] text-gray-400 font-medium">Download on the</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href={googlePlayStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-black hover:bg-gray-900 border border-white/10 rounded-2xl transition duration-200 shadow-xl group cursor-pointer w-[180px] justify-center"
            >
              {/* Google Play SVG Icon */}
              <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
                <path d="M5 3.25c-.28 0-.53.13-.7.34l10.96 10.96 3.82-3.82L5 3.25zM3.48 4.29c-.06.18-.09.39-.09.61v14.2c0 .22.03.43.09.61l7.85-7.85-7.85-7.96zM15.26 15.65L4.3 20.41c.17.21.42.34.7.34h.01l14.1-8.1-3.85-3.0zM19.97 12c0-.18-.04-.36-.12-.51L16.03 15l3.82 3.82c.08-.15.12-.33.12-.51V12.69z" />
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[10px] text-gray-400 font-medium">GET IT ON</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
            </a>
          </div>

          <div className="pt-2 text-gray-400 text-xs sm:text-sm">
            Available on iOS and Android. Seamless progress sync across devices.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
