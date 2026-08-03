"use client";

import { Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only numbers."),
});

interface RegisterStepOTPProps {
  data: {
    otp: string[];
    verified: boolean;
  };
  userData: {
    step1: { selectedLanguage: string };
    step2: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    };
    step3: { selectedAgeGroup: string };
    step4: { selectedHobbies: string[] };
    step5: {
      selectedAvatarIndex: number;
      selectedAvatar: string;
    };
    stepUserType: { selectedUserType: string };
  };
  updateData: (data: { otp: string[]; verified: boolean }) => void;
  prevStep: () => void;
}

export default function RegisterStepOTP({
  data,
  userData,
  updateData,
  prevStep,
}: RegisterStepOTPProps) {
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(data.otp);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Send OTP when component mounts
  useEffect(() => {
    if (!otpSent) {
      sendOTP();
    }
  }, []);

  const sendOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      // Send only email for OTP generation
      await authApi.register({ email: userData.step2.email });

      setOtpSent(true);
      setCountdown(60); // Start 60 second countdown
      setMessage("OTP sent successfully! Please check your email.");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Allow only numbers
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      updateData({ otp: newOtp, verified: false });

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Combine OTP digits into a string
    const otpString = otp.join("");

    // Validate OTP with Zod
    const result = otpSchema.safeParse({ otp: otpString });

    if (!result.success) {
      setError(result.error.format().otp?._errors[0] || "Invalid OTP.");
      return;
    }

    setRegisterLoading(true);

    try {
      // verification data
      const verifyData = {
        otpCode: otpString,
        data: {
          firstName: userData.step2.firstName,
          lastName: userData.step2.lastName,
          email: userData.step2.email,
          password: userData.step2.password,
          age: userData.step3.selectedAgeGroup,
          hobbies: userData.step4.selectedHobbies.join(", "),
          profilePic: userData.step5.selectedAvatar,
          language: userData.step1.selectedLanguage,
          userType: userData.stepUserType.selectedUserType,
        },
      };

      // console.log("Sending to backend:", verifyData); // Debug log

      const result = await authApi.verifyOtp(verifyData);

      // console.log("Backend response:", result); // Debug log

      if (result.success) {
        setSuccess(true);
        updateData({ otp, verified: true });
        setMessage("Registration successful! Redirecting to login...");

        // Only redirect on success
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setError(result.message || "OTP verification failed");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      // console.log("Full error object:", error);
      // console.log("Error response:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleResend = async () => {
    await sendOTP();
  };

  return (
    <div className="w-full min-h-screen bg-[#05061E] flex items-center justify-center px-4 notranslate">
      <div className="w-full max-w-md space-y-8">
        {success ? (
          <div className="space-y-2 bg-gradient-to-br from-[#2A2B4C] to-[#272945] p-8 rounded-xl text-center">
            {/* Success message */}
            <Image
              src="/success-vector.png"
              alt="Success"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <h2 className="text-white font-semibold text-xl">
              Registration Successful!
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Your account has been created successfully. Redirecting to sign
              in...
            </p>
          </div>
        ) : (
          <div className="space-y-2 bg-gradient-to-br from-[#2A2B4C] to-[#272945] p-6 sm:p-8 rounded-xl">
            <div className="text-center">
              <h1 className="inline-block text-3xl sm:text-4xl font-bold uppercase bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-transparent bg-clip-text">
                Manifex
              </h1>
              <h2 className="text-white font-semibold text-lg sm:text-xl mt-4">
                Verify Your Email
              </h2>
              <p className="text-gray-300 text-sm mt-2">
                Enter the 6-digit code sent to {userData.step2.email}
              </p>
              <p className="text-amber-300/80 text-xs mt-2 italic">
                Please check SPAM folder for verification email
              </p>

              {/* Success/Info Messages */}
              {message && (
                <p className="text-green-400 text-sm mt-2">{message}</p>
              )}
              {loading && (
                <p className="text-blue-400 text-sm mt-2">Sending OTP...</p>
              )}
              {otpSent && !loading && !message && (
                <p className="text-green-400 text-sm mt-2">
                  OTP sent successfully! Please check your inbox or spam folder.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 sm:mt-14">
              {/* OTP Input Fields*/}
              <div className="flex justify-between gap-2 sm:gap-3 md:gap-4 px-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center bg-[#333450] text-white rounded-lg sm:rounded-xl border border-gray-500 focus:outline-none focus:border-[#3797CD] text-lg font-medium flex-1 max-w-[50px] sm:max-w-none"
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
              )}

              <div className="flex items-center justify-center mt-6">
                <h1 className="text-gray-300 text-sm text-center">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading || countdown > 0}
                    className="text-gradient font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Sending..."
                      : countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Resend"}
                  </button>
                </h1>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 py-3 rounded-xl bg-gray-600 text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer disabled:opacity-50 text-sm sm:text-base"
                >
                  {registerLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Verifying...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
