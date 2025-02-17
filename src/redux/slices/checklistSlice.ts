import { apiSlice1 } from "./apiSlice";


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










// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface ChecklistItem {
//   id: string;
//   text: string;
//   isCompleted: boolean;
// }

// interface ChecklistState {
//   items: ChecklistItem[];
// }

// const initialState: ChecklistState = {
//   items: [],
// };

// const checklistSlice = createSlice({
//   name: 'checklist',
//   initialState,
//   reducers: {
//     addChecklistItem: (state, action: PayloadAction<ChecklistItem>) => {
//       state.items.push(action.payload);
//     },
//     toggleChecklistItem: (state, action: PayloadAction<string>) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item) {
//         item.isCompleted = !item.isCompleted;
//       }
//     },
//     deleteChecklistItem: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//     },
//   },
// });

// export const { addChecklistItem, toggleChecklistItem, deleteChecklistItem } = checklistSlice.actions;
// export default checklistSlice.reducer; 