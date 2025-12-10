import { baseApi } from "@/redux/api/baseApi";

const presentationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPowerWords: builder.query({
      query: () => ({
        url: "/presentation/power-words/get_power_words",
        method: "GET",
      }),
    }),
    getPowerWordsScore: builder.mutation({
      query: (data) => ({
        url: "/presentation/power-words/power_words",
        method: "POST",
        body: data,
      }),
    
    }),
  }),
});

export const {} = presentationApi;
