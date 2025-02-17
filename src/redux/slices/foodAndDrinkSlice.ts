import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface FoodAndDrink {
    id: string;
    name: string;
    isBooked: boolean | null;
    link: string;
    reservationNumber: string;
    note: string;
}

interface FoodAndDrinkState {
    items: FoodAndDrink[];
}

const initialState: FoodAndDrinkState = {
    items: [],
};

const foodAndDrinkSlice = createSlice({
    name: "foodAndDrink",
    initialState,
    reducers: {
        addFoodAndDrink: (state, action: PayloadAction<FoodAndDrink>) => {
            state.items.push(action.payload);
        },
        removeFoodAndDrink: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addFoodAndDrink, removeFoodAndDrink } = foodAndDrinkSlice.actions;
export default foodAndDrinkSlice.reducer;
