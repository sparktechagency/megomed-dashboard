import { baseApi } from "../../apiBaseQuery";

export const VerifyRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCheckVerifyUsers: builder.query({
      query: () => `/users/all-users`,
      providesTags: ["verifyRequest"],
    }),

    updateStatusUser: builder.mutation({
      query: ({ message, status, id }) => ({
        url: `/users/verify-profile/${id}?status=${status}&message=${message}`,
        method: "PATCH",
      }),
      invalidatesTags: ["verifyRequest"],
    }),

  }),
});

export const { useGetAllCheckVerifyUsersQuery, useUpdateStatusUserMutation } = VerifyRequestApi;