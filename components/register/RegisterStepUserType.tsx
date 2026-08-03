"use client";
import Image from "next/image";
import React, { useState, ChangeEvent } from "react";

interface RegisterStepThreeProps {
  data: {
    selectedUserType: string;
  };
  updateData: (data: { selectedUserType: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ResgisterStepUserType: React.FC<RegisterStepThreeProps> = ({
  data,
  updateData,
  nextStep,
  prevStep,
}) => {
  const [selectedUserType, setSelectedUserType] = useState<string>(
    data.selectedUserType
  );
  const userTypes: string[] = ["adult", "student"];

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const newUserType = e.target.value;
    setSelectedUserType(newUserType);
    updateData({ selectedUserType: newUserType });
  };

  const handleNext = () => {
    if (selectedUserType) {
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
            Select your User Type. This helps us create a personalized
            experience.
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
              Select your User Type
            </h1>

            {/* Age Group Selector */}
            <div>
              <select
                value={selectedUserType}
                onChange={handleUserTypeChange}
                className="w-full bg-[#24263A] border border-gray-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F176B7] mt-2 uppercase"
              >
                <option value="" disabled>
                  Select an User Type
                </option>
                {userTypes.map((userType, index) => (
                  <option className="uppercase" key={index} value={userType}>
                    {userType}
                  </option>
                ))}
              </select>
            </div>
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
            disabled={!selectedUserType}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResgisterStepUserType;
