import { baseApi } from "../../apiBaseQuery";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: ({ page, limit }) => ({
        url: "/category",
        params: { page, limit },
      }),
      providesTags: ["categories"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategoryStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoryApi;
