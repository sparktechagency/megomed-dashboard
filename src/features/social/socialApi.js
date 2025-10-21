import { baseApi } from "../../apiBaseQuery";

export const socialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLink: builder.mutation({
      query: (data) => ({
        url: `/social-link/create-social-link`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["social"],
    }),

    getSocialLink: builder.query({
      query: () => ({
        url: `/social-link`,
        method: "GET",
      }),
      providesTags: ["social"],
    }),

    deleteSocialLink: builder.mutation({
      query: (id) => ({
        url: `/social-link/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["social"],
    }),
  }),
});

export const {
  useCreateLinkMutation,
  useGetSocialLinkQuery,
  useDeleteSocialLinkMutation,
} = socialApi;
