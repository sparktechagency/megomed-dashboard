import { baseApi } from "../../apiBaseQuery";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDriver: builder.query({
      query: (page) => `/user/all-drivers?page=${page}`,
      providesTags: ["driverManagement"],
    }),

    totalDriverCount: builder.query({
      query: () => "/user/all-driver-count",
      providesTags: ["driverManagement"],
    }),

    getAllRecentDriver: builder.query({
      query: (page) => `/user/total-resent-driver?page=${page}&limit=${5}`,
      providesTags: ["driverManagement"],
    }),

    driverBlock: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/block-driver/${id}`,
        method: "PATCH",
        body: data
      }),
      providesTags: ["driverManagement"]
    }),



  }),
});

export const {
  useGetAllDriverQuery,
  useTotalDriverCountQuery,
  useGetAllRecentDriverQuery,
  useDriverBlockMutation
} = driverApi;
