"use client";

import React from "react";
import { Skeleton } from "antd";

const LearningProgressSkeleton = () => {
  return (
    <div className="mt-6 w-full flex flex-col lg:flex-row gap-10 lg:items-stretch animate-pulse">

      {/* LEFT SIDE */}
      <div className="flex-1 bg-[#2B2E4E] p-6 rounded-2xl shadow-lg">
        <Skeleton active title={false} paragraph={{ rows: 1 }} />

        <div className="mt-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton.Input key={i} active block size="large" />
          ))}
        </div>

        <div className="mt-8">
          <Skeleton paragraph={{ rows: 1 }} active />
          <Skeleton.Input active block size="large" />
        </div>
      </div>

      {/* RIGHT SIDE GRID */}
      <div className="flex-1 grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#2B2E4E] p-6 rounded-2xl shadow-lg"
          >
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton.Input active block size="large" className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningProgressSkeleton;
