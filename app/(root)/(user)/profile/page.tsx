"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaCheck, FaUserEdit } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { authApi, usersApi, plansApi, subscriptionApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { MdOutlineSettings } from "react-icons/md";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import toast from "react-hot-toast";
import Tabs from "@/components/ui/Tabs";
import { CgProfile } from "react-icons/cg";
import FamilyMembersManager from "@/components/profile/FamilyMembersManager";
import Cookies from "js-cookie";
import { useLanguageStore, languages } from "@/stores/languageStore";
import { SubscriptionStatus } from "@/components/profile/SubscriptionStatus";

// Minimal ProfileSection component used inside Tabs to avoid "Cannot find name 'ProfileSection'"
// You can replace this with the real component import later.
const ProfileSection: React.FC<any> = ({
  firstName,
  lastName,
  language,
  hobby,
  isUpdatingProfile,
  setFirstName,
  setLastName,
  setLanguage,
  setHobby,
  handleUpdateProfile,
}) => {
  return (
    <div className="space-y-6">
      <div className="w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
        <div className="flex justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold">Profile</h1>
          <button
            onClick={handleUpdateProfile}
            disabled={isUpdatingProfile}
            className="flex items-center justify-center gap-2 bg-gradient-brand text-xs sm:text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <FaUserEdit className="w-5 h-5" />
            <span>{isUpdatingProfile ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>

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
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white notranslate"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
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
    </div>
  );
};

interface Plan {
  id: string;
  planName: string;
  amount: number;
  PlanType: string;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  maxMembers: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

const getAvailableHobbies = (currentAge: string): string[] => {
  switch (currentAge) {
    case "6-9":
      return ["Animals", "Sports", "Dance"];
    case "10-13":
      return ["Animals", "Sports", "Dance", "Music", "Gaming", "Art"];
    case "14-17":
      return ["Animals", "Sports", "Dance", "Music", "Gaming", "Science", "Art", "Cooking"];
    case "18-40":
      return ["Animals", "Sports", "Dance", "Music", "Gaming", "Science", "Art", "Cooking", "Meditation"];
    default:
      return ["Animals", "Sports", "Dance", "Music", "Gaming", "Science", "Art", "Cooking", "Meditation"];
  }
};

function ProfilePage() {
  const router = useRouter();
  const { user, logout: storeLogout, setUser } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [language, setLanguage] = useState("");
  const [hobby, setHobby] = useState("");
  const [age, setAge] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAgeChange = (newAge: string) => {
    setAge(newAge);
    const allowed = getAvailableHobbies(newAge);
    const currentList = hobby ? hobby.split(", ").map(item => item.trim()) : [];
    const filtered = currentList.filter((h) => allowed.includes(h));
    setHobby(filtered.join(", "));
  };

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setHobby(user.hobbies || "");
      setLanguage(user.language || "English");
      setAge(user.age || "");
    }
  }, [user]);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await plansApi.getAllPlans();
        if (response.success) {
          setPlans(response.data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans");
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // Fetch subscription data

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required!");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const formData = new FormData();

      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("hobbies", hobby.trim());
      formData.append("language", language.trim());
      formData.append("age", age.trim());

      const result = await usersApi.updateProfile(formData);

      // Update the user in the auth store
      if (user && result.data) {
        const updatedUser = {
          ...user,
          firstName: result.data.firstName || firstName.trim(),
          lastName: result.data.lastName || lastName.trim(),
          hobbies: result.data.hobbies || hobby.trim(),
          language: result.data.language || language.trim(),
          age: result.data.age || age.trim(),
          profilePic: result.data.profilePic || user.profilePic,
        };
        setUser(updatedUser);

        // Find the language code and update the language store to reload page
        const langObj = languages.find(
          (l) => l.name === (result.data.language || language.trim())
        );
        if (langObj) {
          useLanguageStore.getState().setLanguage(langObj.code);
        }
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully! Logging out...");
        setTimeout(() => {
          storeLogout();
          router.push("/signin");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };
  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getMySubscription();
      if (res.success) {
        setSubscription(res.data);
      }
    } catch (err) {
      console.log("Error loading subscription", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    storeLogout();
    console.log("Logout Successful.");
    router.push("/signin");
  };

  // Get user's current plan data
  const getUserCurrentPlan = () => {
    if (!user) return null;

    // If user has a subscription, find the corresponding plan
    if (user.Subscription && user.Subscription.plan) {
      return user.Subscription.plan;
    }

    // If no subscription but isSubscriptionFree is false, find Premium plan
    if (user.isSubscriptionFree === false) {
      return (
        plans.find((plan) => plan.planName === "Premium") ||
        plans.find((plan) => plan.planName === "Family")
      );
    }

    // Free trial user - find Free Trial plan
    return plans.find((plan) => plan.planName === "Free Trial");
  };

  // Determine user plan status
  const getUserPlanStatus = () => {
    const currentPlan = getUserCurrentPlan();
    // console.log(currentPlan, "");

    return currentPlan?.planName || "Free Trial";
  };

  // Get plan data for display
  const getUserPlanData = () => {
    const currentPlan = getUserCurrentPlan();

    if (!currentPlan) {
      // Fallback data if no plan found
      return {
        title: "Free Trial",
        price: "$0",
        duration: "7-day trial",
        features: [
          "5 Lessons per day",
          "Basic progress tracking",
          "Limited reward content",
          "Mercury AI guidance",
        ],
        buttonText: "Upgrade Plan",
        isPaid: false,
      };
    }

    return {
      title: currentPlan.planName,
      price: `$${currentPlan.amount}`,
      duration:
        currentPlan.interval === "month"
          ? "per month"
          : currentPlan.interval === "week"
          ? "per week"
          : currentPlan.interval === "year"
          ? "per year"
          : "lifetime",
      features: currentPlan.features || [],
      buttonText:
        user?.isSubscriptionFree === false ? "Current Plan" : "Upgrade Plan",
      isPaid: user?.isSubscriptionFree === false,
    };
  };

  const getSubscriptionDetails = () => {
    if (!user?.Subscription) return null;

    return {
      planName: user.Subscription.plan?.planName || "Premium",
      startDate: new Date(user.Subscription.startDate).toLocaleDateString(),
      endDate: new Date(user.Subscription.endDate).toLocaleDateString(),
      paymentStatus: user.Subscription.paymentStatus,
      amount: user.Subscription.amount,
      currency: user.Subscription.plan?.currency || "USD",
    };
  };

  const handleUpgradePlan = () => {
    router.push("/pricing");
  };

  const handleManageSubscription = () => {
    router.push("/pricing");
  };

  const userPlanData = getUserPlanData();
  const subscriptionDetails = getSubscriptionDetails();

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
        <div className="w-full flex flex-col items-center justify-center">
          {/* Avatar */}
          <div className="relative w-36 h-36">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to p-1.5">
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
                  userPlanData.isPaid ? "text-yellow-400" : "text-gray-400"
                }`}
              />
              <span>{getUserPlanStatus()}</span>
            </div>
          </div>
        </div>
        {/* // add tabs option here in future if needed  */}
        {getUserPlanStatus() === "Family" ? (
          <div className="w-full">
            <Tabs
              variant="underline"
              tabs={[
                {
                  label: "Personal Information",
                  icon: <CgProfile className="h-4 w-4" />,

                  content: (
                    <div className="flex gap-8  flex-col ">
                      <div className="mt-8 w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
                        <div className="flex justify-between">
                          <h1 className="text-xl sm:text-2xl font-semibold">
                            Personal Information
                          </h1>
                          <button
                            onClick={handleUpdateProfile}
                            disabled={isUpdatingProfile}
                            className="flex items-center justify-center gap-2 bg-gradient-brand text-xs sm:text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            <FaUserEdit className="w-5 h-5" />
                            <span>
                              {isUpdatingProfile ? "Saving..." : "Save Profile"}
                            </span>
                          </button>
                        </div>

                        {/* Info Holder */}
                        <div className="mt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <label
                                htmlFor="firstName"
                                className="text-sm text-gray-300">
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
                              <label
                                htmlFor="lastName"
                                className="text-sm text-gray-300">
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
                              <label
                                htmlFor="language"
                                className="text-sm text-gray-300">
                                Language Preference
                              </label>
                              <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white notranslate"
                              >
                                {languages.map((lang) => (
                                  <option key={lang.code} value={lang.name}>
                                    {lang.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                             <div className="flex flex-col gap-2">
                              <label className="text-sm text-gray-300">
                                Hobby (Select max 2)
                              </label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {getAvailableHobbies(age).map((h) => {
                                  const currentList = hobby ? hobby.split(", ").map(item => item.trim()) : [];
                                  const isSelected = currentList.includes(h);
                                  return (
                                    <button
                                      key={h}
                                      type="button"
                                      onClick={() => {
                                        if (isSelected) {
                                          const newList = currentList.filter(item => item !== h);
                                          setHobby(newList.join(", "));
                                        } else {
                                          if (currentList.length >= 2) {
                                            toast.error("You can select maximum 2 hobbies");
                                            return;
                                          }
                                          const newList = [...currentList, h];
                                          setHobby(newList.join(", "));
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                                        isSelected
                                          ? "bg-gradient-brand border-transparent text-white"
                                          : "bg-[#35364E] border-gray-600 text-gray-300 hover:text-white"
                                      }`}
                                    >
                                      {h}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="flex flex-col gap-2">
                              <label
                                htmlFor="age"
                                className="text-sm text-gray-300">
                                Age Group
                              </label>
                              <select
                                id="age"
                                value={age}
                                onChange={(e) => handleAgeChange(e.target.value)}
                                className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white"
                              >
                                <option value="" disabled>
                                  Select an age group
                                </option>
                                <option value="6-9">6-9</option>
                                <option value="10-13">10-13</option>
                                <option value="14-17">14-17</option>
                                <option value="18-40">18-40</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Subscription Status */}
                        <SubscriptionStatus
                          user={user}
                          plans={plans}
                          isLoadingPlans={isLoadingPlans}
                        />

                        {/* Security Section */}
                        <div className="bg-gradient-to-br from-[#28284A] via-[#12122A] to-[#12122A] text-white p-6 rounded-2xl flex flex-col justify-between">
                          <div>
                            <h1 className="text-xl sm:text-2xl font-semibold">
                              Security
                            </h1>
                            <p className="text-gray-300 mt-2">
                              Change your password from here.
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col gap-2">
                            <div className="flex flex-col gap-1.5">
                              <label
                                htmlFor="currentPassword"
                                className="text-sm text-gray-300">
                                Current Password
                              </label>
                              <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                  setCurrentPassword(e.target.value)
                                }
                                placeholder="Enter your current password"
                                className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-gray-300"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label
                                htmlFor="newPassword"
                                className="text-sm text-gray-300">
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
                                className="text-sm text-gray-300">
                                Confirm Password
                              </label>
                              <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                placeholder="Enter your new password"
                                className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-gray-300"
                              />
                            </div>
                            <button
                              onClick={handleChangePassword}
                              disabled={isChangingPassword}
                              className="mt-4 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                              {isChangingPassword
                                ? "Updating..."
                                : "Update Password"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "Family Members Settings",
                  icon: <MdOutlineSettings className="h-4 w-4" />,
                  content: (
                    <FamilyMembersManager
                      subscription={subscription}
                      onRefresh={fetchSubscription}
                    />
                  ),
                },
              ]}
              className=""
            />
          </div>
        ) : (
          <div className="w-full">
            <div className="my-8 w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
              <div className="flex justify-between">
                <h1 className="text-xl sm:text-2xl font-semibold">
                  Personal Information
                </h1>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                  className="flex items-center justify-center gap-2 bg-gradient-brand text-xs sm:text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <FaUserEdit className="w-5 h-5" />
                  <span>
                    {isUpdatingProfile ? "Saving..." : "Save Profile"}
                  </span>
                </button>
              </div>

              {/* Info Holder */}
              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm text-gray-300">
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
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white notranslate"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300">
                      Hobby (Select max 2)
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {getAvailableHobbies(age).map((h) => {
                        const currentList = hobby ? hobby.split(", ").map(item => item.trim()) : [];
                        const isSelected = currentList.includes(h);
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                const newList = currentList.filter(item => item !== h);
                                setHobby(newList.join(", "));
                              } else {
                                if (currentList.length >= 2) {
                                  toast.error("You can select maximum 2 hobbies");
                                  return;
                                }
                                const newList = [...currentList, h];
                                setHobby(newList.join(", "));
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                              isSelected
                                ? "bg-gradient-brand border-transparent text-white"
                                : "bg-[#35364E] border-gray-600 text-gray-300 hover:text-white"
                            }`}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="age" className="text-sm text-gray-300">
                      Age Group
                    </label>
                    <select
                      id="age"
                      value={age}
                      onChange={(e) => handleAgeChange(e.target.value)}
                      className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white"
                    >
                      <option value="" disabled>
                        Select an age group
                      </option>
                      <option value="6-9">6-9</option>
                      <option value="10-13">10-13</option>
                      <option value="14-17">14-17</option>
                      <option value="18-40">18-40</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Subscription Status */}
              <SubscriptionStatus
                user={user}
                plans={plans}
                isLoadingPlans={isLoadingPlans}
              />

              {/* Security Section */}
              <div className="bg-gradient-to-br from-[#28284A] via-[#12122A] to-[#12122A] text-white p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    Security
                  </h1>
                  <p className="text-gray-300 mt-2">
                    Change your password from here.
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="currentPassword"
                      className="text-sm text-gray-300">
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
                    <label
                      htmlFor="newPassword"
                      className="text-sm text-gray-300">
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
                      className="text-sm text-gray-300">
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
                    className="mt-4 py-2.5 w-full rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info */}
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 sm:py-4 border border-red-500/20 bg-red-500/10 text-red-400 text-xl font-semibold rounded-2xl hover:bg-red-500/20 transition cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProtectedRoute(ProfilePage);
