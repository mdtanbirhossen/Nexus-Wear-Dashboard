import { apiSlice } from "../apiSlice";

export const adminApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // adminApi.ts
          getAllAdmins: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string }) => ({
                    url: `/admin`,
                    params,
               }),
               providesTags: ["Admin"],
          }),

          getAdminById: builder.query({
               query: (adminId) => `/admin/${adminId}`
          }),

          deleteAdmin: builder.mutation({
               query: (adminId) => ({
                    url: `/admin/${adminId}`,
                    method: "DELETE",
               })
          }),

          createAdmin: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/admin',
                    method: "POST",
                    body: formData
               }),
               invalidatesTags: ["Admin"],
          }),
          updateAdminDetails: builder.mutation({
               query: ({ formData, adminId }) => ({
                    url: `/admin/${adminId}`,
                    method: "PATCH",
                    body: formData
               }),
               invalidatesTags: ["Admin"]
          }),


     }),
});

export const { useGetAllAdminsQuery, useDeleteAdminMutation, useGetAdminByIdQuery, useCreateAdminMutation, useUpdateAdminDetailsMutation } = adminApi;
