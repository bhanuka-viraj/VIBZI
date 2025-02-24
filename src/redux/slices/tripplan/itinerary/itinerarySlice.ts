import { apiSlice1 } from "../../apiSlice";

interface TripPlanItinerarySearchParams {
    tripPlanId?: string;
    title?: string;
    page?: number;
    size?: number;
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
    })
});

export const {
    useGetTripPlanItineraryByIdQuery
  } = itinerarySlice;