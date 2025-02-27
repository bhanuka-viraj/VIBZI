import { apiSlice1 } from "../apiSlice";

export interface AttachmentResponse {
  id: string;
  tripId: string;
  title: string;
  attachments: Array<{
    key: string;
    originalFilename: string;
    fileUrl: string;
  }>;
}

export const attachmentSlice = apiSlice1.injectEndpoints({
  endpoints: (builder) => ({
    uploadAttachment: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `/common-service/trip-plan-attachment/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["attachments"],
    }),
    getAttachmentsByTripId: builder.query<AttachmentResponse, string>({
      query: (tripId) => ({
        url: `/common-service/trip-plan-attachment?tripId=${tripId}`,
        method: "GET",
      }),
      providesTags: ["attachments"],
    }),
    deleteAttachment: builder.mutation<
      void,
      { tripId: string; fileKey: string }
    >({
      query: ({ tripId, fileKey }) => ({
        url: `/common-service/trip-plan-attachment/remove`,
        method: "DELETE",
        params: { tripId, fileKey },
      }),
      invalidatesTags: ["attachments"],
    }),
  }),
});

export const {
  useUploadAttachmentMutation,
  useGetAttachmentsByTripIdQuery,
  useDeleteAttachmentMutation,
} = attachmentSlice;
