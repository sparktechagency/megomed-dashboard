import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfileSettings: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
    }),

    getProfileSettings: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useUpdateProfileSettingsMutation,
  useGetProfileSettingsQuery,
} = offerApi;
