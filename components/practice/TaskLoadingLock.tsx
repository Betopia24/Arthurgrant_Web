"use client";

import React from "react";
import { Lock, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface CommonCardProps {
  title: string;
  description?: string;
  variant: "locked" | "loading" | "error";
  onClick?: () => void;
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const TaskLoadingLockError: React.FC<CommonCardProps> = ({
  title,
  description,
  variant,
  onClick,
  onRetry,
  className = "",
  children,
}) => {
  const baseClasses =
    "p-6 bg-[#FFFFFF1F] border rounded-2xl min-h-52 flex flex-col items-center justify-center gap-4 w-full transition-all";

  const variantClasses = {
    locked: "cursor-not-allowed opacity-60 border-white/15",
    loading: "cursor-wait border-white/15 animate-pulse",
    error: "cursor-pointer border-red-400/30 hover:border-red-400/50",
  };

  const handleClick = () => {
    if (variant === "error" && onRetry) {
      onRetry();
    } else if (onClick) {
      onClick();
    }
  };

  // Skeleton UI for loading state
  if (variant === "loading") {
    return (
      <div
        className={`${baseClasses} ${variantClasses.loading} ${className}`}
        role="status"
        aria-label="Loading...">
        {/* Skeleton Header */}
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="w-5 h-5 bg-white/30 rounded-full"></div>
          <div className="h-6 bg-white/30 rounded w-32"></div>
        </div>

        {/* Skeleton Description */}
        {description && (
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="h-4 bg-white/30 rounded w-3/4"></div>
            <div className="h-4 bg-white/30 rounded w-1/2"></div>
          </div>
        )}

        {/* Skeleton Content */}
        {children ? (
          <div className="w-full">
            {React.Children.map(children, (child, index) => (
              <div
                key={index}
                className="h-4 bg-white/20 rounded w-full mb-2"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full mt-4">
            <div className="h-3 bg-white/20 rounded w-full"></div>
            <div className="h-3 bg-white/20 rounded w-4/5"></div>
            <div className="h-3 bg-white/20 rounded w-3/4"></div>
          </div>
        )}

        {/* Skeleton Footer */}
        <div className="flex items-center justify-center gap-2 w-full mt-4">
          <div className="w-4 h-4 bg-white/30 rounded-full"></div>
          <div className="h-3 bg-white/30 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      role={variant === "error" ? "button" : undefined}
      tabIndex={variant === "error" ? 0 : -1}>
      {/* Header Section */}
      <div className="flex items-center justify-center gap-3">
        {variant === "locked" && <Lock className="w-5 h-5 text-white/60" />}
        {variant === "error" && (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        <h3 className="font-semibold text-xl text-white">{title}</h3>
      </div>

      {/* Description */}
      {description && (
        <p
          className={`text-center text-base leading-relaxed ${
            variant === "error" ? "text-red-300" : "text-white/70"
          }`}>
          {description}
        </p>
      )}

      {/* Content */}
      {children}

      {/* Error Retry Message */}
      {variant === "error" && (
        <div className="flex items-center justify-center gap-2 text-red-300 text-sm mt-2">
          <RefreshCw className="w-4 h-4" />
          Click to retry
        </div>
      )}
    </div>
  );
};

export default TaskLoadingLockError;
