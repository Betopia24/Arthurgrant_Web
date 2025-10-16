"use client";
import RegisterStepFirst from "@/components/register/RegisterStepFirst";
import RegisterStepSecond from "@/components/register/RegisterStepSecond";
import RegisterStepThree from "@/components/register/RegisterStepThree";
import RegisterStepFour from "@/components/register/RegisterStepFour";
import RegisterStepFive from "@/components/register/RegisterStepFive";
import RegisterStepOTP from "@/components/register/RegisterStepOTP";
import React, { useState } from "react";
import { ProtectedAuthRoute } from "@/components/shared/ProtectedAuthRoute";

// Define the complete data structure for all steps
export interface RegisterData {
  step1: {
    selectedLanguage: string;
  };
  step2: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  step3: {
    selectedAgeGroup: string;
  };
  step4: {
    selectedHobbies: string[];
  };
  step5: {
    selectedAvatarIndex: number;
    selectedAvatar: string;
  };
  stepOTP: {
    otp: string[];
    verified: boolean;
  };
}

function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    step1: {
      selectedLanguage: "English",
    },
    step2: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    step3: {
      selectedAgeGroup: "18-24",
    },
    step4: {
      selectedHobbies: [],
    },
    step5: {
      selectedAvatarIndex: 0,
      selectedAvatar: "/avatar.png",
    },
    stepOTP: {
      otp: ["", "", "", "", "", ""],
      verified: false,
    },
  });

  const updateFormData = (step: keyof RegisterData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log("Final form data:", formData);
    // Move to OTP verification step
    nextStep();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegisterStepFirst
            data={formData.step1}
            updateData={(data) => updateFormData("step1", data)}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <RegisterStepSecond
            data={formData.step2}
            updateData={(data) => updateFormData("step2", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <RegisterStepThree
            data={formData.step3}
            updateData={(data) => updateFormData("step3", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <RegisterStepFour
            data={formData.step4}
            updateData={(data) => updateFormData("step4", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <RegisterStepFive
            data={formData.step5}
            updateData={(data) => updateFormData("step5", data)}
            prevStep={prevStep}
            onSubmit={handleSubmit}
          />
        );
      case 6:
        return (
          <RegisterStepOTP
            data={formData.stepOTP}
            userData={formData}
            updateData={(data) => updateFormData("stepOTP", data)}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderCurrentStep()}</>;
}

export default ProtectedAuthRoute(SignUp);
