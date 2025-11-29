import { baseApi } from "@/redux/api/baseApi";

const rewardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkDailyRewards: builder.query({
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
