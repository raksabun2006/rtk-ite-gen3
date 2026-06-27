import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UploadResponse {
  name: string; 
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
  }),
  tagTypes: ["Files"],
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<UploadResponse, FormData>({
      query: (formData) => {
        return {
          url: '/medias/upload-multiple',
          method: "POST",
      
          body: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),
  }),
});

export const { useUploadFilesMutation } = uploadApi;