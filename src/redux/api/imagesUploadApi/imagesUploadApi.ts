import { apiSlice } from "../apiSlice";

export const imagesUploadApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // imagesUploadApi.ts
          uploadImages: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/r2-upload/product-image',
                    method: "POST",
                    body: formData,
                    responseHandler: async (response) => {
                         return await response.text();
                    },
               })
          }),
     }),
});


export const { useUploadImagesMutation } = imagesUploadApi;
