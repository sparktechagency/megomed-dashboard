import { baseApi } from "../../apiBaseQuery";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (data) => ({
        url: `/service-type/create-service-type`,
        method: "POST",
        body: data,
        // Important: let the browser set the correct Content-Type for FormData
        headers: {
          // Explicitly do not set Content-Type to let browser set it with boundary
          "Content-Type": undefined,
        },
      }),
      invalidatesTags: ["service"],
    }),

    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/service-type/${id}`,
        method: "PATCH",
        body: data,
        // Important: let the browser set the correct Content-Type for FormData
        headers: {
          // Explicitly do not set Content-Type to let browser set it with boundary
          "Content-Type": undefined,
        },
      }),
      invalidatesTags: ["service"],
    }),

    updateServiceStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/service-type/${id}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["service"],
    }),

    getParticularService: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: ["service"],
    }),

    getAllServices: builder.query({
      query: () => ({
        url: `/service-type`,
        method: "GET",
      }),
      providesTags: ["service"],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["service"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useUpdateServiceStatusMutation,
  useGetParticularServiceQuery,
  useGetAllServicesQuery,
  useDeleteServiceMutation,
} = serviceApi;
