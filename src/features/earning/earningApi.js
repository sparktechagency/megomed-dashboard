import { baseApi } from '../../apiBaseQuery';

export const earningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarning: builder.query({
      query: ({ month, year, searchTerm, page }) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (page) params.append('page', page);

        return `/payment?${params.toString()}`;
      },
      providesTags: ['Earnings'],
    }),
  }),
});

export const { useGetEarningQuery } = earningApi;