import { baseApi } from "../../apiBaseQuery";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: `/package/create-package`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subscription"],
    }),

    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/package/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["subscription"],
    }),

    getSubscription: builder.query({
      query: () => ({
        url: `/package/packages`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),

    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/package/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useGetSubscriptionQuery,
  useDeleteSubscriptionMutation,
} = subscriptionApi;
