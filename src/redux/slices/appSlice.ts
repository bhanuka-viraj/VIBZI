import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  hasCompletedOnboarding: false,
  isLoading: true,
  error: null,
};

export const checkOnboardingStatus = createAsyncThunk(
  'app/checkOnboardingStatus',
  async () => {
    const status = await AsyncStorage.getItem('hasCompletedOnboarding');
    return status === 'true';
  },
);

export const completeOnboarding = createAsyncThunk(
  'app/completeOnboarding',
  async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    return true;
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(checkOnboardingStatus.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
        state.hasCompletedOnboarding = action.payload;
        state.isLoading = false;
      })
      .addCase(completeOnboarding.fulfilled, state => {
        state.hasCompletedOnboarding = true;
      });
  },
});

export default appSlice.reducer;
