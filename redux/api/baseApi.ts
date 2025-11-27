/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { setUser } from "../features/auth/authSlice";
import { useAuthStore } from "@/stores/authStore";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = useAuthStore();

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      const refreshToken = (api.getState() as RootState).auth.refresh_token;

      // if (!refreshToken) {
      //   api.dispatch(logout());
      //   Swal.fire({
      //     icon: "error",
      //     title: "Session Expired",
      //     text: "Please login again to continue",
      //   });
      //   return result;
      // }

      // Make a request to refresh the token
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const data = await res.json();
      if (data?.success) {
        const user = (api.getState() as RootState).auth.user;
        api.dispatch(
          setUser({ user, token: data.data.token, refresh_token: refreshToken })
        );

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Swal.fire({
        //   icon: "error",
        //   title: "Session Expired",
        //   text: "Please login again to continue",
        //   showConfirmButton: false,
        //   showCancelButton: true,
        //   cancelButtonText: "Stay Logged Out",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     api.dispatch(logout());
        //     signOut();
        //   } else if (result.isDismissed) {
        //     api.dispatch(logout());
        //     signOut();
        //   }
        // });
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["user", "example", "payment", "Progress"],
  endpoints: () => ({}),
});
