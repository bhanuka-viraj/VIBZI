import { apiSlice1 } from "../../apiSlice";

interface TripPlanItinerarySearchParams {
    tripPlanId?: string;
    title?: string;
    page?: number;
    size?: number;
}

interface TripPlanItinerary {
    id?: string; 
    tripPlanId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;   
  }
  
interface TripPlanItineraryCreate { tripId: string; itinerary: any; }

export const itinerarySlice = apiSlice1.injectEndpoints({
    endpoints: (builder) => ({
        getTripPlanItineraryById: builder.query<TripPlanItineraryCreate, TripPlanItineraryCreate>({
            query: (id) => ({
                url: `/common-service/trip-plan-itinerary/by-trip-id/${id}`,
                method: 'GET'
            }),
            providesTags: ['itineraries']
        }),
        updateTripPlanItinerary: builder.mutation<TripPlanItinerary, { id: string; data: Partial<TripPlanItinerary> }>({
            query: ({ id, data }) => ({
              url: `/common-service/trip-plan-itinerary/${id}`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: ['itineraries'], 
          }),
    })
});

export const {
    useGetTripPlanItineraryByIdQuery,
    useUpdateTripPlanItineraryMutation
  } = itinerarySlice;