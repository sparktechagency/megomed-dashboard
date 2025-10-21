import { baseApi } from "../../apiBaseQuery";

export const totalEarningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    totalEarning: builder.mutation({
      query: ({ page, limit, paymentType }) => ({
        url: `/payment?page=${page}&limit=${limit}&paymentType=${paymentType}`,
        method: "GET",
      }),
      invalidatesTags: ["totalEarning"],
    }),
  }),
});

export const { useTotalEarningMutation } = totalEarningApi;
