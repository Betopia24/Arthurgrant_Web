import React from "react";
import Heading, { Heading2 } from "../shared/Heading";
import Image from "next/image";
import { activities } from "@/lib/constants";
import Link from "next/link";
import { Check } from "lucide-react";
import { FaLock } from "react-icons/fa";

const RewardVideo = () => {
  return (
    <div className="w-full">
      <Heading2
        heading="Learning Feels Better When, You're Rewarded"
        subheading="Daily practice unlocks new videos, matched to your passion— sports, dance, cooking, and more"
        specialText="You're Rewarded"
        align="center"
      />

      <div className="w-full bg-gradient-to-br from-[#2B2E4E] to-brand-darker p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-8 items-stretch mt-6">
        {/* Left - Image */}
        <div className="flex-1">
          <img
            src="/featuring-02.png"
            alt="Feature"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Right - Info & Activities */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Icon + Heading */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#4C4F69] p-3">
              <Image
                src="/icon-04.png"
                alt="placeholder"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Today's Session
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Complete the following activities
              </p>
            </div>
          </div>

          {/* Activities list */}
          <ul className="flex flex-col gap-2 mt-2">
            {activities.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-white text-sm sm:text-base">
                {item.done ? (
                  <div className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full text-white">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center bg-gray-400 rounded-full text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>

          {/* Lock Button */}
          <Link
            href="#"
            className="mt-2 xl:mt-8 inline-flex items-center gap-2 justify-center rounded-xl bg-gradient-brand px-6 py-2 text-white font-semibold hover:opacity-90 w-max">
            <FaLock />
            See Full Video
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RewardVideo;
