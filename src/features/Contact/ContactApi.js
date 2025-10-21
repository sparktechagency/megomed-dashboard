import { baseApi } from "../../apiBaseQuery";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContact: builder.query({
      query: () => ({
        url: "/contact-us",
      }),
      providesTags: ["contacts"],
    }),
  }),
});

export const {
  useGetContactQuery
} = contactApi;
