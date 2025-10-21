import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: () => "/users/my-profile",
      providesTags: ["profie"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-my-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: "/user/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useProfileQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
} = offerApi;
