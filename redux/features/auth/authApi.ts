import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["User"],
    }),
    loginWithGoogle: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "google-login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "forgot-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "reset-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user/me",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userInfo) => {
        return {
          url: "register",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    otp: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/verify-reset-password-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    getMe: builder.query({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    contact: builder.mutation({
      query: (contactData) => {
        return {
          url: "/contacts/send-email",
          method: "POST",
          body: contactData,
        };
      },
    }),
  }),
});

export const { useContactMutation } = authApi;
