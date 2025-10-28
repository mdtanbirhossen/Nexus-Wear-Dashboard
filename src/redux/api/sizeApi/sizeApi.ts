import { apiSlice } from "../apiSlice";

export const sizeApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // adminApi.ts
          getAllsizes: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string }) => ({
                    url: `/size`,
                    params,
               }),
               providesTags: ["Size"],
          }),

          getSizeById: builder.query({
               query: (sizeId) => `/size/${sizeId}`,
          }),

          deleteSize: builder.mutation({
               query: (sizeId) => ({
                    url: `/size/${sizeId}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["Size"],
          }),

          createSize: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/size',
                    method: "POST",
                    body: formData
               }),
               invalidatesTags: ["Size"],
          }),
          updateSizeDetails: builder.mutation({
               query: ({ formData, sizeId }) => ({
                    url: `/size/${sizeId}`,
                    method: "PATCH",
                    body: formData
               }),
               invalidatesTags: ["Size"]
          }),


     }),
});



export const { useGetAllsizesQuery, useGetSizeByIdQuery, useDeleteSizeMutation, useCreateSizeMutation, useUpdateSizeDetailsMutation } = sizeApi;
