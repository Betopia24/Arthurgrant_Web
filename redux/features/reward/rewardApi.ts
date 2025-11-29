import { baseApi } from "@/redux/api/baseApi";
import { DailyCheckRewardResponseType } from "@/types/rewardTypes";

const rewardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkDailyRewards: builder.query<DailyCheckRewardResponseType, void>({
      query: () => ({
        url: "/reward-video/check/daily/rewards",
        method: "GET",
      }),
      providesTags: ["Rewards"],
    }),

    getAllRewards: builder.query({
      query: () => ({
        url: "/reward-video",
        method: "GET",
      }),
      providesTags: ["Rewards"],
    }),
  }),
});

export const { useCheckDailyRewardsQuery, useGetAllRewardsQuery } = rewardApi;
