"use client";

import React from "react";

interface SkeletonCardProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = "h-24",
  width = "w-full",
  borderRadius = "rounded-xl",
  className = "",
}) => {
  return (
    <div
      className={`bg-[#FFFFFF1F] animate-pulse ${height} ${width} ${borderRadius} ${className}`}
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  height?: string;
  width?: string;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  height = "h-4",
  width = "w-full",
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-[#FFFFFF1F] animate-pulse rounded ${height} ${
            index === lines - 1 ? "w-3/4" : width
          }`}
        />
      ))}
    </div>
  );
};

interface SkeletonCircleProps {
  size?: string;
  className?: string;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = "w-12 h-12",
  className = "",
}) => {
  return (
    <div
      className={`bg-[#FFFFFF1F] animate-pulse rounded-full ${size} ${className}`}
    />
  );
};
