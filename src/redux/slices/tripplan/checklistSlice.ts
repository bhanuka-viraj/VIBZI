import { apiSlice1 } from "../apiSlice";


interface ChecklistItem {
  id?: string;
  description: string;
  isChecked?: boolean;
}

interface TripPlanChecklist {
  id: string;
  tripId: string;
  checklist: ChecklistItem[];
}

export const checklistSlice = apiSlice1.injectEndpoints({
  endpoints: (builder) => ({
    getTripPlanChecklistByTripId: builder.query<TripPlanChecklist, string>({
      query: (tripId) => ({
        url: `/common-service/trip-plan-checklist/by-trip-id/${tripId}`,
        method: "GET",
      }),
      providesTags: ["checklists"],
    }),

    updateTripPlanChecklist: builder.mutation<
      TripPlanChecklist,
      { id: string; data: Partial<TripPlanChecklist> }
    >({
      query: ({ id, data }) => ({
        url: `/common-service/trip-plan-checklist/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["checklists"],
    }),
  }),
});

export const {
  useGetTripPlanChecklistByTripIdQuery,
  useUpdateTripPlanChecklistMutation,
} = checklistSlice;