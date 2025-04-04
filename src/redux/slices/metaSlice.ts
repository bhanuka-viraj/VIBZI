import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MetaState {
  title: string;
  trip: {
    select_date: string;
    id: string;
    tripId: string;
    itinerary: {
      id?: string;
      tripId?: string;
      itinerary?: Record<string, any[]>;
    } | null;
  };
}

const initialState: MetaState = {
  title: "VIBZI",
  trip: {
    select_date: "",
    id: "",
    tripId: "",
    itinerary: null,
  },
};

export const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    setTripDate: (state, action: PayloadAction<string>) => {
      state.trip.select_date = action.payload;
    },
    setTripId: (state, action: PayloadAction<string>) => {
      state.trip.id = action.payload;
    },
    setTrip_Id: (state, action: PayloadAction<string>) => {
      state.trip.tripId = action.payload;
    },
    setitinerary: (state, action: PayloadAction<any>) => {
      state.trip.itinerary = action.payload;
    },
  },
});

export const { setTripDate, setTripId, setTrip_Id, setitinerary } = metaSlice.actions;
export default metaSlice.reducer;
