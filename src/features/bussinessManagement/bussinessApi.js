import { baseApi } from "../../apiBaseQuery";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bussinessAllShop: builder.query({
      query: (page) => `/admin/dashboard/get-shops?page=${page}`,
      providesTags: ["businessManagement", "shop"],
    }),

    bussinessShopOffer: builder.query({
      query: (page) => `/admin/dashboard/get-shops-offers?page=${page}`,
      providesTags: ["businessManagement"],
    }),

    updateRevenue: builder.mutation({
      query: (data) => ({
        url: `/admin/dashboard/update-shop-revenue/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["businessManagement"],
    }),

    updateStatus: builder.mutation({
      query: (data) => ({
        url: `/admin/dashboard/update-shop-status/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["businessManagement"],
    }),

    updateOfferStatus: builder.mutation({
      query: (data) => ({
        url: `/admin/dashboard/update-offer-status/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["businessManagement"],
    }),
  }),
});

export const {
  useBussinessAllShopQuery,
  useBussinessShopOfferQuery,
  useUpdateOfferStatusMutation,
  useUpdateRevenueMutation,
  useUpdateStatusMutation,
} = businessApi;
