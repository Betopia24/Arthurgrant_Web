import { baseApi } from "@/redux/api/baseApi";

const generateRandomToken = () => {
  const randomId = Math.floor(10000 + Math.random() * 90000);
  return `temp-${randomId}`;
};

const chatbotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatbotMessage: builder.mutation<
      { chatbot_reply: string },
      { message: string }
    >({
      async queryFn({ message }) {
        try {
          const res = await fetch("https://ai.manifex.org/api/v1/chatbot/web", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authtoken: "guest",
            },
            body: JSON.stringify({
              user_id: generateRandomToken(),
              user_message: message,
            }),
          });

          if (!res.ok) {
            return {
              error: {
                status: res.status,
                data: await res.text(),
              },
            };
          }

          const data = await res.json();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message || String(error),
            },
          };
        }
      },
    }),
  }),
});

export const { useSendChatbotMessageMutation } = chatbotApi;
