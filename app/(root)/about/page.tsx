import React from "react";
import Link from "next/link";
import About from "@/components/landing/About";
import Heading from "@/components/shared/Heading";
import { Rocket } from "lucide-react";
import { aboutUsInfo } from "@/lib/constants";

export default function Page() {
  return (
    <div className="pt-10 sm:pt-16 bg-section-dark">
      <About />
      <div className="app-container py-20 bg-section-dark">
        {/* Heading */}
        <Heading
          heading="At the Core of Our Approach are 4 Key Foundations"
          subheading="MANIFEX is here to redefine the way people learn English. For children with dyslexia, for students aiming to sharpen skills, for
professionals preparing for communication — learning should be adaptive, encouraging, and fun."
          specialText="4 Key Foundations"
          align="center"
        />

        {/* Infos */}
        <div className="mt-20 flex flex-col gap-20">
          {aboutUsInfo.sections.map((section, idx) => (
            <div
              key={section.title}
              className={`flex flex-col lg:flex-row items-center lg:gap-16 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 flex justify-center px-6 lg:px-10">
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full h-auto object-contain rounded-xl shadow-lg 
                     max-w-md lg:max-w-lg xl:max-w-xl"
                />
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4 px-6 lg:px-10">
                <h3 className="text-2xl sm:text-3xl font-semibold">
                  {idx + 1}. {section.title}
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom */}
      <div className="px-8 py-20 flex gap-10 flex-col items-center justify-center bg-brand-darker">
        <h1 className="text-center max-w-6xl text-lg md:text-xl lg:text-2xl">
          By blending science, rhythm, and creativity, we give every learner the
          opportunity to grow at their own pace. Whether you are building
          foundational skills, learning to speak English, or simply practicing
          before presenting to a large audience, our mission is to make the
          journey both empowering and enjoyable.
        </h1>
        <Link
          href="#"
          className="bg-gradient-brand rounded-2xl font-semibold px-6 py-3 flex gap-2 items-center justify-center"
        >
          <Rocket />
          <span>Start Learning Today</span>
        </Link>
      </div>
    </div>
  );
}
