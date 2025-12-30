import React from "react";
import Heading from "../shared/Heading";
import Image from "next/image";

const About = () => {
  // Features data
  const features = [
    {
      icon: "/icon-05.png",
      title: "Real-Time Analytics",
      description:
        "Built with cognitive science principles and tested with dyslexia specialists",
    },
    {
      icon: "/icon-01.png",
      title: "Advanced AI Technology",
      description:
        "Machine learning adapts to individual learning patterns and preferences",
    },
    {
      icon: "/icon-05.png",
      title: "Passion-Driven Learning",
      description:
        "Connect education with personal interests for maximum engagement",
    },
  ];

  // Stats data
  const stats = [
    { value: "100K+", label: "100,000+ Learners" },
    { value: "98%", label: "Positive Rating" },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-[#1A1646] via-[#05051E] to-[#05051E]">
      <div className="app-container flex flex-col lg:flex-row items-center lg:items-end gap-12">
        {/* Left Side Content */}
        <div className="max-w-3xl">
          {/* Section Heading */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-6 text-white">
            About MANIFEX
          </h1>

          <Heading
            heading="We Created MANIFEX with One Mission"
            subheading="Make English learning simple, engaging, and accessible. For dyslexia learners, professionals, and anyone who wants to master communication, this is a revolution powered by AI."
            specialText="One Mission"
            align="left"
          />

          {/* Features */}
          <div className="mt-10 space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 flex justify-around sm:justify-start gap-8 sm:gap-14">
            {stats.map((stat, index) => (
              <div key={index} className="text-start">
                <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <Image
            src="/featuring-01.png"
            alt="About MANIFEX"
            width={600}
            height={600}
            className="rounded-2xl shadow-lg object-contain w-full max-w-[640px] max-h-[520px]"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
