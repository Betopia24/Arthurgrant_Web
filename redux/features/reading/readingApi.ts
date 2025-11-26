import { baseApi } from "@/redux/api/baseApi";

const readingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReading: builder.mutation({
      query: (data) => ({
        url: "/reading-task/submit",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { } = readingApi;
