import { apiSlice } from "../apiSlice";

export const colorApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // adminApi.ts
          getAllColors: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string }) => ({
                    url: `/color`,
                    params,
               }),
               providesTags: ["Color"],
          }),

          getColorById: builder.query({
               query: (colorId) => `/color/${colorId}`
          }),

          deleteColor: builder.mutation({
               query: (colorId) => ({
                    url: `/color/${colorId}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["Color"]
          }),

          createColor: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/color',
                    method: "POST",
                    body: formData
               }),
               invalidatesTags: ["Color"],
          }),
          updateColorDetails: builder.mutation({
               query: ({ formData, colorId }) => ({
                    url: `/color/${colorId}`,
                    method: "PATCH",
                    body: formData
               }),
               invalidatesTags: ["Color"]
          }),


     }),
});



export const { useGetAllColorsQuery,useGetColorByIdQuery,useDeleteColorMutation,useCreateColorMutation,useUpdateColorDetailsMutation } = colorApi;
