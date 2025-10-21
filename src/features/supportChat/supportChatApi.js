import { baseApi } from "../../apiBaseQuery";

export const supportChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportChat: builder.mutation({
      query: (formData) => ({
        url: `/support-message/send-messages`,
        method: "POST",
        body: formData,
        // Don't set Content-Type header, let the browser set it with boundary for FormData
        prepareHeaders: (headers) => {
          // Remove any existing Content-Type header to let the browser set it
          headers.delete("Content-Type");
          return headers;
        },
      }),
      invalidatesTags: ["supportChat"],
    }),

    updateSupportChat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/support-message/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["supportChat"],
    }),

    getChatList: builder.query({
      query: () => ({
        url: `/support-message/my-chat-list`,
        method: "GET",
      }),
      providesTags: ["supportChat"],
    }),

    getChatMessagesbyChatId: builder.query({
      query: (chatId) => ({
        url: `/support-message/my-messages/${chatId}`,
        method: "GET",
      }),
      providesTags: ["supportChat"],
    }),

    deleteSupportChat: builder.mutation({
      query: (id) => ({
        url: `/support-message/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supportChat"],
    }),
  }),
});

export const {
  useCreateSupportChatMutation,
  useUpdateSupportChatMutation,
  useGetChatListQuery,
  useGetChatMessagesbyChatIdQuery,
  useDeleteSupportChatMutation,
} = supportChatApi;
