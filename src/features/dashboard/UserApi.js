import { baseApi } from "../../apiBaseQuery";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (page) => `/user/all-users?page=${page}`,
      providesTags: [],
    }),

    totalUserCount: builder.query({
      query: () => "/user/total-users-count",
      providesTags: [],
    }),

    getAllRecentUser: builder.query({
      query: (page) => `/user/total-resent-users?page=${page}&limit=${5}`,
      providesTags: [],
    }),

    userBlock: builder.mutation({
      query: ({ data, id }) => ({
        url: `/user/block-user/${id}`,
        method: "PATCH",
        body: data
      }),
    }),



  }),
});

export const {
  useGetAllUserQuery,
  useTotalUserCountQuery,
  useGetAllRecentUserQuery,
  useUserBlockMutation
} = userApi;
