import { baseApi } from "../../apiBaseQuery";

export const ReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReport: builder.query({
      query: () => `/report`,
      providesTags: ["report"],
    }),


    // Forgot Password
    reportedWithAdmin: builder.mutation({
      query: ({ id, message }) => ({
        url: `/report/${id}`,
        method: "PATCH",
        body: message,
      }),
    }),



  }),
});

export const { useGetAllReportQuery, useReportedWithAdminMutation } = ReportApi;
