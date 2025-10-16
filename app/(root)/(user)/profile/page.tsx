"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaUserEdit } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { authApi, usersApi } from "@/lib/api"; // Make sure usersApi is imported
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

// Mocked plan data
const myPlan = [
  {
    title: "Premium",
    price: "$19",
    duration: "per month",
    features: [
      "Unlimited lessons",
      "Advanced progress analytics",
      "Full reward library access",
      "Priority AI support",
      "Parent dashboard",
      "Offline mode",
    ],
    buttonText: "Start With Premium Plan",
    highlight: true,
  },
];

function ProfilePage() {
  const router = useRouter();
  const { user, logout: storeLogout, setUser } = useAuthStore();

  // Local state for user info and password
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [language, setLanguage] = useState("");
  const [hobby, setHobby] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setHobby(user.hobbies || "");
      setLanguage("English"); // Default or from user data if available
    }
  }, [user]);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message.text]);

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setMessage({
        type: "error",
        text: "First name and last name are required!",
      });
      return;
    }

    setIsUpdatingProfile(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      // Create profile data object
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        hobbies: hobby.trim(),
        // Note: language might need to be handled separately if your API supports it
      };

      // Append the data as JSON string
      formData.append("data", JSON.stringify(profileData));

      const result = await usersApi.updateProfile(formData);

      // Update the user in the auth store
      if (user) {
        const updatedUser = {
          ...user,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          hobbies: hobby.trim(),
          profilePic: result.data?.profilePic || user.profilePic,
        };
        setUser(updatedUser);
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long!",
      });
      return;
    }

    setIsChangingPassword(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });

      if (response.success) {
        setMessage({
          type: "success",
          text: "Password changed successfully! Logging out...",
        });

        // Wait 1.5 seconds to show success message, then logout and redirect to login
        setTimeout(() => {
          storeLogout();
          router.push("/signin");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to change password",
        });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "An error occurred while changing password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    storeLogout();
    console.log("Logout Successful.");
    router.push("/signin");
  };

  // Determine user plan status
  const getUserPlanStatus = () => {
    if (user?.isSubscribed) {
      return "Premium";
    }
    return "Free";
  };

  const getUserPlanFeatures = () => {
    if (user?.isSubscribed) {
      return myPlan[0].features;
    }
    return [
      "Limited lessons",
      "Basic progress analytics",
      "Limited reward access",
      "Standard support",
    ];
  };

  // This check is now redundant since HOC handles it, but keeping it as fallback
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="py-32 sm:pt-36 md:pt-40 min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker">
      <div className="app-container flex flex-col items-center gap-8">
        {/* Message Display */}
        {message.text && (
          <div
            className={`w-full p-4 rounded-xl text-center ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : message.type === "error"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="w-full flex flex-col items-center justify-center">
          {/* Avatar */}
          <div className="relative w-36 h-36">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to p-1.5">
              {/* Inner circle to hold the image */}
              <div className="bg-black rounded-full w-full h-full overflow-hidden">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 w-full flex gap-1 flex-col items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">{user.email}</p>
            <div className="bg-[#24243B] border border-gray-700 rounded-full flex items-center justify-center gap-2 px-6 py-2 mt-4 text-base sm:text-lg">
              <IoDiamond
                className={`w-6 h-5 ${
                  user.isSubscribed ? "text-yellow-400" : "text-gray-400"
                }`}
              />
              <span>{getUserPlanStatus()} User</span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mt-8 w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
          <div className="flex justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Personal Information
            </h1>
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="flex items-center justify-center gap-2 bg-gradient-brand text-xs sm:text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUserEdit className="w-5 h-5" />
              <span>{isUpdatingProfile ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>

          {/* Info Holder */}
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm text-gray-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm text-gray-300">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="language" className="text-sm text-gray-300">
                  Language Preference
                </label>
                <input
                  id="language"
                  type="text"
                  placeholder="English"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={true}
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-gray-300 opacity-50 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="hobby" className="text-sm text-gray-300">
                  Hobby
                </label>
                <input
                  id="hobby"
                  type="text"
                  placeholder="Photography"
                  value={hobby}
                  onChange={(e) => setHobby(e.target.value)}
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status + Security */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
            <h1 className="text-xl mb-2 sm:text-2xl font-semibold">
              Subscription Status
            </h1>
            <p className="text-lg sm:text-xl text-gradient inline-block font-semibold">
              {getUserPlanStatus()} User
            </p>
            <ul className="flex flex-col gap-3 mt-4">
              {getUserPlanFeatures().map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-200">
                  <FaCheck className="text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled={user.isSubscribed}
                className="py-2.5 rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user.isSubscribed ? "Current Plan" : "Upgrade to Premium Plan"}
              </button>
              <button
                disabled={!user.isSubscribed}
                className="mt-2 relative py-2.5 rounded-xl bg-gradient-brand h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-[1px] bg-[#0B0C23] rounded-xl p-2 flex justify-center items-center">
                  <h1 className="text-gradient font-semibold">
                    {user.isSubscribed ? "Cancel Plan" : "No Active Plan"}
                  </h1>
                </div>
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#28284A] via-[#12122A] to-[#12122A] text-white p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Security</h1>
              <p className="text-gray-300 mt-2">
                Change your password from here.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="currentPassword"
                  className="text-sm text-gray-300"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="newPassword" className="text-sm text-gray-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-gray-300"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-gray-300"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="mt-4 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 sm:py-4 border border-red-500/20 bg-red-500/10 text-red-400 text-xl font-semibold rounded-2xl hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Component is wrapped with HOC which is Protected Route so unwanted guests can't enter this lovely little secret page.
export default ProtectedRoute(ProfilePage);
