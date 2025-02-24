import { apiSlice1 } from "../apiSlice";

interface TripPlan {
  title: string;
  startDate: string;
  endDate: string;
  destinationId: number;
  destinationName: string;
  description: string;
  userId: string;
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
  endpoints: (builder) => ({
    createTripPlan: builder.mutation<TripPlanResponse, TripPlan>({
      query: (data) => ({
        url: `/common-service/trip-plan`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["trips"],
    }),

    getTripPlanById: builder.query<TripPlan, string>({
      query: (userId) => ({
        url: `/common-service/trip-plan/${userId}`,
        method: "GET",
      }),
      providesTags: ["trips-id"],
    }),

    searchTripPlans: builder.query<TripPlan[], TripPlanSearchParams>({
      query: (data) => {
        console.log( 'data - ',data);
        return {
          url: `/common-service/trip-plan/search`,
          method: "POST",
          body: data,
        };
      },
      providesTags: ["trips"],
    }),

    updateTripPlan: builder.mutation<TripPlan, { id: string; data: Partial<TripPlan> }>({
      query: ({ id, data }) => ({
        url: `/common-service/trip-plan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["trips", "trips-id"],
    }),

    deleteTripPlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/common-service/trip-plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["trips"],
    }),
  }),
});

export const {
  useCreateTripPlanMutation,
  useGetTripPlanByIdQuery,
  useSearchTripPlansQuery,
  useUpdateTripPlanMutation,
  useDeleteTripPlanMutation,
} = tripPlanSlice; 