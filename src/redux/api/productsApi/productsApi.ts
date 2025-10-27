import { apiSlice } from "../apiSlice";

export const productsApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // productsApi.ts
          getAllProducts: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string }) => ({
                    url: `/product`,
                    params,
               }),
               providesTags: ["Product"],
          }),

          getProductById: builder.query({
               query: (productId) => `/product/${productId}`
          }),

          deleteProduct: builder.mutation({
               query: (productId) => ({
                    url: `/product/${productId}`,
                    method: "DELETE",
               })
          }),

          createProduct: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/product',
                    method: "POST",
                    body: formData
               }),
               invalidatesTags: ["Product"],
          }),
          updateProductDetails: builder.mutation({
               query: ({ formData, productId }) => ({
                    url: `/product/${productId}`,
                    method: "PATCH",
                    body: formData
               }),
               invalidatesTags: ["Product"]
          }),
     }),
});

export const { useGetAllProductsQuery,useGetProductByIdQuery,useDeleteProductMutation,useCreateProductMutation,useUpdateProductDetailsMutation } = productsApi;
