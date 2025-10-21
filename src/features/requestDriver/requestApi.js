import { baseApi } from '../../apiBaseQuery';


export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDriverRequest: builder.query({
      query: ({ page }) => `/user/all-drivers-request?page=${page}`,
      providesTags: ["driverManagement"],
    }),

    getDriverRequestCount: builder.query({
      query: () => `/user/all-drivers-request-count`,
      providesTags: ["driverManagement"],
    }),

    driverApprove: builder.mutation({
      query: (data) => ({
        url: `/user/driver/${data.id}`,
        method: "PATCH",
        body: data.body,  // { "action": "approve" }
      }),
      invalidatesTags: ["driverManagement"],
    }),

    driverReject: builder.mutation({
      query: (data) => ({
        url: `/user/driver/${data.id}`,
        method: "PATCH",
        body: data.body,  // { "action": "reject" }
      }),
      invalidatesTags: ["driverManagement"],
    }),

    driverAllAproved: builder.mutation({
      query: (data) => ({
        url: `/user/driver-approve`,
        method: "PATCH",
        body: data?.body,  // { "action": "approve" }
      }),
      invalidatesTags: ["driverManagement"],
    }),


    driverAllRejected: builder.mutation({
      query: (data) => ({
        url: `/user/driver-reject`,
        method: "PATCH",
        body: data?.body,  // { "action": "reject" }
      }),
      invalidatesTags: ["driverManagement"],
    }),


  }),
});

export const { useDriverAllAprovedMutation, useDriverAllRejectedMutation, useDriverApproveMutation, useDriverRejectMutation, useGetDriverRequestQuery, useGetDriverRequestCountQuery } =
  requestApi;
