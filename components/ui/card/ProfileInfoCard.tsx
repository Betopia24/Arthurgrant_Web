"use client";

import React from "react";
import { FaUserEdit } from "react-icons/fa";

interface ProfileInfoCardProps {
  firstName: string;
  lastName: string;
  language: string;
  hobby: string;
  isUpdatingProfile: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setLanguage: (value: string) => void;
  setHobby: (value: string) => void;
  handleUpdateProfile: () => void;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
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
    <div className="mt-8 w-full bg-gradient-to-br from-[#28284A] to-[#12122A] text-white p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="p-2.5 text-sm border border-gray-600 bg-[#35364E] rounded-xl text-white"
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
  );
};

export default ProfileInfoCard;
