import { baseApi } from "../../apiBaseQuery";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => "/payment/overview-all",
      providesTags: ["dashboard"],
    }),
    getTotalRevenueChartdata: builder.query({
      query: (year) => `/payment/all-earning-rasio?year=${year}`,
      providesTags: ["dashboard"],
    }),
    getClientFreelancerByRegion: builder.query({
      query: () => "/payment/freelancer-clients-country-region",
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetTotalRevenueChartdataQuery,
  useGetClientFreelancerByRegionQuery,
} = dashboardApi;
