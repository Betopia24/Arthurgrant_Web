import { apiRequest } from "@/lib/apiRequest";
import { SubscriptionResponseTypes } from "@/types/subscriptionTypes";
import { useEffect, useState } from "react";

const useGetSubscriptionData = () => {
  const [data, setData] = useState<SubscriptionResponseTypes | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await apiRequest("/subscriptions/my-subscription", "GET");

      setData(res);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    data,
    isLoading,
    isError,
  };
};

export default useGetSubscriptionData;
