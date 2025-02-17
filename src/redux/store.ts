import { configureStore } from '@reduxjs/toolkit';
import { apiSlice, apiSlice1 } from './slices/apiSlice';
import metaReducer from './slices/metaSlice';

// Custom middleware to log API calls
const rtkQueryErrorLogger = () => (next: any) => (action: any) => {
  // RTK Query uses `api` in action types
  if (action?.type?.startsWith('apiOne') || action?.type?.startsWith('apiTwo')) {
    console.log('RTK Query Action:', action);
  }
  if (action?.error) {
    console.error('RTK Query Error:', action.error);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [apiSlice1.reducerPath]: apiSlice1.reducer,
    meta: metaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware, apiSlice1.middleware)
      .concat(rtkQueryErrorLogger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;