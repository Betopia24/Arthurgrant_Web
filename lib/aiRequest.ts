import { useAuthStore } from "@/stores/authStore";

export const aiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const userId = useAuthStore.getState().user?.id;

    if (!accessToken) {
      console.warn("Blocked: No access token found.");
      return null;
    }

    // Check if body is FormData to set appropriate headers
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {
      authtoken: `${accessToken}`,
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${process.env.NEXT_PUBLIC_AI_API}${endpoint}${separator}user_id=${userId}`;

    const res = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Request failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("AI Request Error:", err);
    throw err;
  }
};
