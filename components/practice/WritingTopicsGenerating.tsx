"use client";
import { useAuthStore } from "@/stores/authStore";
import React, { useState } from "react";

interface WritingTopicsGeneratingProps {
  onSuccess?: (wordRelativeData: any) => void; // callback to pass API data
}

const WritingTopicsGenerating: React.FC<WritingTopicsGeneratingProps> = ({
  onSuccess,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [age, setAge] = useState(""); // input for age
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const handleFetchData = async () => {
    if (!age) {
      setError("Please enter age");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://206.162.244.135:8061/api/v1/writing/category?age=${age}`,
        {
          method: "GET",
          headers: {
           authtoken: `${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch data");
      }

      const wordRelativeData = await res.json();
      onSuccess?.(wordRelativeData); // pass data to parent
      setShowInput(false);
      setAge(""); // clear input
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Enter Age & Fetch Categories
        </button>
      )}

      {showInput && (
        <div className="flex flex-col gap-2 mt-2">
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <input
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleFetchData}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setAge("");
                setError(null);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingTopicsGenerating;
