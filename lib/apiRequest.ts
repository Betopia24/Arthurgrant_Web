import { useAuthStore } from "@/stores/authStore";

export const apiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: any
) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      console.warn("Blocked: No access token found.");
      return null;
    }

    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Only set JSON header when not FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}${endpoint}`,
      {
        method,
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      }
    );

    // Handle non-JSON responses safely
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} - ${response.statusText}`
      );
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error("API Request Error:", error);
    return null;
  }
};
