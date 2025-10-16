"use client";

import { Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  };
  updateData: (data: { otp: string[]; verified: boolean }) => void;
  prevStep: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function RegisterStepOTP({ 
  data, 
  userData, 
  updateData, 
  prevStep 
}: RegisterStepOTPProps) {
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(data.otp);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  // Send OTP when component mounts
  useEffect(() => {
    if (!otpSent) {
      sendOTP();
    }
  }, []);

  const sendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/auth/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.step2.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpSent(true);
        setError(null);
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error sending OTP:", error);
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

  // Handle Backspace (when the user deletes a digit)
  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Focus the previous input if the current one is empty
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle form submission (OTP verification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      // Convert hobbies array to comma-separated string
      const hobbiesString = userData.step4.selectedHobbies.join(", ");

      // complete user data for verification
      const verifyData = {
        otpCode: otpString,
        data: {
          firstName: userData.step2.firstName,
          lastName: userData.step2.lastName,
          email: userData.step2.email,
          password: userData.step2.password,
          age: userData.step3.selectedAgeGroup,
          hobbies: hobbiesString, // Converted to comma-separated string
          profilePic: userData.step5.selectedAvatar
        }
      };

      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        updateData({ otp, verified: true });
        
        // Redirect to signin page after success
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setError(result.message || "OTP verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error verifying OTP:", error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleResend = async () => {
    await sendOTP();
  };

  return (
    <div className="w-full min-h-screen bg-[#05061E] flex items-center justify-center px-4">
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
              Your account has been created successfully. Redirecting to sign in...
            </p>
          </div>
        ) : (
          <div className="space-y-2 bg-gradient-to-br from-[#2A2B4C] to-[#272945] p-8 rounded-xl">
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
              {loading && (
                <p className="text-blue-400 text-sm mt-2">
                  Sending OTP...
                </p>
              )}
              {otpSent && !loading && (
                <p className="text-green-400 text-sm mt-2">
                  OTP sent successfully! Please Check your Inbox or Spam Folder.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-14">
              {/* OTP Input Fields */}
              <div className="flex justify-between gap-4">
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
                    className="w-12 h-12 text-center bg-[#333450] text-white rounded-xl border border-gray-500 focus:outline-none focus:border-[#3797CD]"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

              <div className="flex items-center justify-center mt-6">
                <h1 className="text-gray-300">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-gradient font-semibold disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Resend"}
                  </button>
                </h1>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 py-2 rounded-xl bg-gray-600 text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer disabled:opacity-50"
                >
                  {registerLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
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