import {apiSlice1} from '../apiSlice';

interface TripPlan {
  id: string;
  tripId: string;
  title: string;
  startDate: string;
  endDate: string;
  destinationId: number;
  destinationName: string;
  description: string;
  userId: string;
  imageUrl: string;
}

interface CreateTripPlanInput {
  title: string;
  startDate: string;
  endDate: string;
  destinationId: number;
  destinationName: string;
  description: string;
  userId: string;
  imageUrl: string;
}

interface TripPlanResponse {
  id: string;
  tripId: string;
  title: string;
  startDate: string;
  endDate: string;
  destinationId: number;
  destinationName: string;
  description: string;
  userId: string;
}

interface TripPlanSearchParams {
  title?: string;
  destinationName?: string;
  userId?: string | null;
  page?: number;
  size?: number;
}

export const tripPlanSlice = apiSlice1.injectEndpoints({
  endpoints: builder => ({
    createTripPlan: builder.mutation<TripPlanResponse, CreateTripPlanInput>({
      query: data => ({
        url: `/common-service/trip-plan`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['trips'],
    }),

    getTripPlanById: builder.query<TripPlan, string>({
      query: userId => ({
        url: `/common-service/trip-plan/${userId}`,
        method: 'GET',
      }),
      providesTags: ['trips-id'],
    }),

    searchTripPlans: builder.query<TripPlan[], TripPlanSearchParams>({
      query: data => {
        // console.log('Search API Request Data:', {
        //   url: '/common-service/trip-plan/search',
        //   method: 'POST',
        //   body: data,
        // });

        return {
          url: `/common-service/trip-plan/search`,
          method: 'POST',
          body: data,
        };
      },
      providesTags: ['trips'],
    }),

    updateTripPlan: builder.mutation<
      TripPlan,
      {id: string; data: Partial<TripPlan>}
    >({
      query: ({id, data}) => ({
        url: `/common-service/trip-plan/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['trips', 'trips-id'],
    }),

    deleteTripPlan: builder.mutation<void, string>({
      query: id => ({
        url: `/common-service/trip-plan/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['trips'],
    }),
    uploadTripPlanCoverImage: builder.mutation<
      void,
      {id: string; file: FormData}
    >({
      query: ({id, file}) => ({
        url: `/common-service/trip-plan/${id}/cover-image`,
        method: 'PATCH',
        body: file,
        formData: true,
        validateStatus: response =>
          response.status >= 200 && response.status < 300,
      }),
      invalidatesTags: ['trips', 'trips-id'],
    }),
  }),
});

export const {
  useCreateTripPlanMutation,
  useGetTripPlanByIdQuery,
  useSearchTripPlansQuery,
  useUpdateTripPlanMutation,
  useDeleteTripPlanMutation,
  useUploadTripPlanCoverImageMutation,
} = tripPlanSlice;
