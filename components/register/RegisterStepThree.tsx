"use client";
import Image from "next/image";
import React, { useState, ChangeEvent } from "react";

interface RegisterStepThreeProps {
  data: {
    selectedAgeGroup: string;
  };
  updateData: (data: { selectedAgeGroup: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const RegisterStepThree: React.FC<RegisterStepThreeProps> = ({
  data,
  updateData,
  nextStep,
  prevStep,
}) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(
    data.selectedAgeGroup
  );

  const ageGroups: string[] = ["6-9", "10-13", "14-17", "18-40"];

  const handleAgeGroupChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const newAgeGroup = e.target.value;
    setSelectedAgeGroup(newAgeGroup);
    updateData({ selectedAgeGroup: newAgeGroup });
  };

  const handleNext = () => {
    if (selectedAgeGroup) {
      nextStep();
    }
  };

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
            Select your age group. This helps us tailor the learning experience.
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
              Select your age group
            </h1>

            {/* Age Group Selector */}
            <div>
              <select
                value={selectedAgeGroup}
                onChange={handleAgeGroupChange}
                className="w-full bg-[#24263A] border border-gray-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F176B7] mt-2">
                <option value="" disabled>
                  Select an age group
                </option>
                {ageGroups.map((ageGroup, index) => (
                  <option key={index} value={ageGroup}>
                    {ageGroup}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={prevStep}
            className="w-1/3 py-2 rounded-xl bg-gray-600 text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer">
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAgeGroup}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterStepThree;
