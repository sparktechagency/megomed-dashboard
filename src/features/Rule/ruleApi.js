import { baseApi } from "../../apiBaseQuery";

export const ruleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // privecyPolicy: builder.mutation({
    //   query: (data) => ({
    //     url: "/rule/privacy-policy",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),

    // termsAndCondition: builder.mutation({
    //   query: (data) => ({
    //     url: "/rule/terms-and-conditions",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),

    // getPrivacy: builder.query({
    //   query: () => `/rule/privacy-policy`,
    //   providesTags: [],
    // }),

    // getTerms: builder.query({
    //   query: () => `/rule/terms-and-conditions`,
    //   providesTags: [],
    // }),
    updatePolicies: builder.mutation({
      query: (data) => ({
        url: "/setting",
        method: "PATCH",
        body: data,
      }),
    }),
    getPolicies: builder.query({
      query: () => `/setting`,
      providesTags: [],
    }),
  }),
});

export const { useUpdatePoliciesMutation, useGetPoliciesQuery } = ruleApi;
