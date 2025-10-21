import { baseApi } from "../../apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => "/notification/admin-all",
      method: "GET",
      providesTags: ["notification"],
    }),
    readNotificationSingle: builder.mutation({
      query: (id) => ({
        url: `/notification/read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),
    readNotificationAll: builder.mutation({
      query: () => ({
        url: `/notification/all-read`,
        method: "POST",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useReadNotificationSingleMutation,
  useReadNotificationAllMutation,
} = notificationApi;
