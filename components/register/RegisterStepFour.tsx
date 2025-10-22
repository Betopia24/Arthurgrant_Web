"use client";
import Image from "next/image";
import React, { useState } from "react";

interface RegisterStepFourProps {
  data: {
    selectedHobbies: string[];
  };
  updateData: (data: { selectedHobbies: string[] }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const RegisterStepFour: React.FC<RegisterStepFourProps> = ({ 
  data, 
  updateData, 
  nextStep, 
  prevStep 
}) => {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(data.selectedHobbies);

  const hobbies: string[] = [
    "Reading",
    "Traveling",
    "Gaming",
    "Cooking",
    "Sports",
    "Music",
    "Technology",
    "Photography",
    "Fitness",
  ];

  const handleHobbySelect = (hobby: string): void => {
    const newHobbies = selectedHobbies.includes(hobby)
      ? selectedHobbies.filter((item) => item !== hobby)
      : [...selectedHobbies, hobby];
    
    setSelectedHobbies(newHobbies);
    updateData({ selectedHobbies: newHobbies });
  };

  const handleNext = () => {
    // You can add validation here if needed, e.g., minimum number of hobbies
    nextStep();
  };

  return (
    <div className="w-full min-h-screen bg-[#05061E] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <div className="text-center">
            <h1 className="inline-block text-3xl sm:text-4xl md:text-5xl font-bold uppercase bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-transparent bg-clip-text">
              Manifex
            </h1>
          </div>

          <p className="text-center text-lg text-gray-300">
            Select your hobbies and interests to personalize your reward videos.
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
            <h1 className="text-white text-xl mb-2 font-semibold">Select Hobbies & Interests</h1>

            {/* Word Selection */}
            <div className="flex flex-wrap gap-2 justify-center">
              {hobbies.map((hobby, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm border-gray-500 font-semibold cursor-pointer transition duration-300 ease-in-out ${
                    selectedHobbies.includes(hobby)
                      ? "bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white"
                      : "bg-[#2D2F4A] text-gray-300 hover:bg-gradient-to-r hover:from-[#FFBC6F] hover:via-[#F176B7] hover:to-[#3797CD] hover:text-white"
                  }`}
                  onClick={() => handleHobbySelect(hobby)}
                >
                  {hobby}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Selected: {selectedHobbies.length} {selectedHobbies.length === 1 ? 'hobby' : 'hobbies'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={prevStep}
            className="w-1/3 py-2 rounded-xl bg-gray-600 text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterStepFour;