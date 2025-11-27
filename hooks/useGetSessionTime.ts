import { useEffect, useRef, useState } from "react";

const useGetSessionTime = () => {
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return formatTime(timeSpent);
};

export default useGetSessionTime;
