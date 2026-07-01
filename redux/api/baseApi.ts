// /* eslint-disable @typescript-eslint/no-unused-vars */
// import {
//   createApi,
//   fetchBaseQuery,
//   BaseQueryFn,
//   FetchArgs,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";
// import { RootState } from "../store";
// import { setUser } from "../features/auth/authSlice";
// import { useAuthStore } from "@/stores/authStore";

// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const { accessToken } = useAuthStore();

//     if (accessToken) {
//       headers.set("authorization", `Bearer ${accessToken}`);
//     }
//     return headers;
//   },
// });

// const baseQueryWithRefreshToken: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error?.status === 401) {
//     try {
//       const refreshToken = (api.getState() as RootState).auth.refresh_token;

//       // if (!refreshToken) {
//       //   api.dispatch(logout());
//       //   Swal.fire({
//       //     icon: "error",
//       //     title: "Session Expired",
//       //     text: "Please login again to continue",
//       //   });
//       //   return result;
//       // }

//       // Make a request to refresh the token
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}refresh-token`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             authorization: `Bearer ${refreshToken}`,
//           },
//         }
//       );

//       const data = await res.json();
//       if (data?.success) {
//         const user = (api.getState() as RootState).auth.user;
//         api.dispatch(
//           setUser({ user, token: data.data.token, refresh_token: refreshToken })
//         );

//         // Retry the original query with the new token
//         result = await baseQuery(args, api, extraOptions);
//       } else {
//         // Swal.fire({
//         //   icon: "error",
//         //   title: "Session Expired",
//         //   text: "Please login again to continue",
//         //   showConfirmButton: false,
//         //   showCancelButton: true,
//         //   cancelButtonText: "Stay Logged Out",
//         // }).then((result) => {
//         //   if (result.isConfirmed) {
//         //     api.dispatch(logout());
//         //     signOut();
//         //   } else if (result.isDismissed) {
//         //     api.dispatch(logout());
//         //     signOut();
//         //   }
//         // });
//       }
//     } catch (error) {
//       console.error("Error during token refresh:", error);
//     }
//   }

//   return result;
// };

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: baseQueryWithRefreshToken,
//   tagTypes: ["user", "example", "payment", "Progress"],
//   endpoints: () => ({}),
// });

//====================================================NAHIAN================================================//
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setUser, logout } from "../features/auth/authSlice";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/authStore";

// Constants
const UNAUTHORIZED_STATUS = 401;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access_token;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }

    headers.set("content-type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // Check if request failed due to unauthorized access
  if (result.error?.status === UNAUTHORIZED_STATUS) {
    console.log("API Request:", result);

    try {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refresh_token;

      // Attempt to refresh token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const responseData = refreshResult.data as {
          success: boolean;
          data: { token: string };
        };

        if (responseData.success) {
          const user = state.auth.user;
          const newToken = responseData.data.token;

          // Update store with new token
          api.dispatch(
            setUser({
              user,
              access_token: newToken,
              refresh_token: refreshToken,
            })
          );

          // Sync Zustand store and cookie
          useAuthStore.getState().setToken(newToken);
          Cookies.set("access_token", newToken, {
            expires: 30,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
          });

          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          handleLogout(api.dispatch);
        }
      } else {
        // Refresh failed, logout user
        handleLogout(api.dispatch);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleLogout(api.dispatch);
    }
  }

  return result;
};

// Helper function to handle logout
const handleLogout = (dispatch: any) => {
  dispatch(logout());
  useAuthStore.getState().logout();
  Cookies.remove("access_token");
  if (typeof window !== "undefined") {
    window.location.href = "/signin?session_expired=true";
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Example", "Payment", "Progress", "Rewards"],
  endpoints: () => ({}),
  // Optional: Add additional configuration
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
  refetchOnMountOrArgChange: true,
});

export default baseApi;
