"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedAuthRoute } from "@/components/shared/ProtectedAuthRoute";

// Zod schema for form validation
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

function SignInPage() {
  const router = useRouter();
  const { login, setUser, setLoading: setStoreLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });
    setApiError("");
    setSuccessMessage("");

    const validationResult = signInSchema.safeParse(formData);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.format();
      setErrors({
        email: errorMessages.email?._errors[0] || "",
        password: errorMessages.password?._errors[0] || "",
      });
      return;
    }

    setLoading(true);
    setStoreLoading(true);

    try {
      // console.log("Login Data: ", formData);

      // Call login API
      const loginResponse = await authApi.login(
        formData.email,
        formData.password
      );

      if (loginResponse.success) {
        // Store the access token
        login(loginResponse.data.accessToken);

        

        // Get user profile
        const profileResponse = await authApi.getProfile();

        if (profileResponse.success) {
          setUser(profileResponse.data);
          setSuccessMessage("Successfully logged in!");
          // console.log("User Profile:", profileResponse.data);

          // last visited route or default to profile from session storage
          const lastRoute = sessionStorage.getItem("lastRoute") || "/profile";

          // Redirect to last visited route after successful login
          setTimeout(() => {
            router.push(lastRoute);
          }, 1000);
        } else {
          setApiError("Failed to fetch user profile");
        }
      } else {
        setApiError(loginResponse.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setApiError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#05061E] flex items-center justify-center px-4 py-10 notranslate">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <div className="text-center">
            <h1 className="inline-block text-3xl sm:text-4xl md:text-5xl font-bold uppercase bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-transparent bg-clip-text">
              Manifex
            </h1>
          </div>

          <p className="text-center text-lg text-gray-300">
            Welcome to MANIFEX! Let's start your language journey today.
          </p>
        </div>

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

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-gray-200 mb-1.5"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#24253A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#F176B7]"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm text-gray-200 mb-1.5"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#24253A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#F176B7]"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-300">
            <label className="flex items-center space-x-2">
              <input type="radio" className="accent-[#3797CD]" />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-blue-300 underline decoration-blue-300 underline-offset-4 px-1 tracking-tight"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFBC6F] via-[#F176B7] to-[#3797CD] text-white font-semibold hover:opacity-90 transition flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {apiError && (
          <p className="text-red-500 text-center mt-4">{apiError}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}

        <p className="text-center text-sm text-gray-100">
          New here?{" "}
          <Link
            href="/signup"
            className="text-blue-300 underline decoration-blue-300 underline-offset-4 px-1 tracking-tight"
          >
            Create new account
          </Link>{" "}
          to get started
        </p>
      </div>
    </div>
  );
}

// component is wrapped with ProtectedAuthRoute so authenticated unnecessaryly comes to any auth page.
export default ProtectedAuthRoute(SignInPage);
