import { baseApi } from "../../apiBaseQuery";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: () => ({
        url: `/invoice`,
        method: "GET",
      }),
      providesTags: ["project"],
    }),
  }),
});

export const { useGetAllProjectsQuery } = projectApi;
