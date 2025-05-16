import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {fetchAuthSession} from '@aws-amplify/auth';

const baseQuery1 = fetchBaseQuery({
  baseUrl: 'https://service.vibzi.co/api/v1',
});

const baseQuery2 = fetchBaseQuery({
  baseUrl: 'https://service.vibzi.co/api/v1',
  prepareHeaders: async (headers, {endpoint}) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken.toString();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (!endpoint?.includes('upload')) {
        headers.set('Content-Type', 'application/json');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'apiOne',
  baseQuery: baseQuery1,
  endpoints: () => ({}),
});

export const apiSlice1 = createApi({
  reducerPath: 'apiTwo',
  baseQuery: baseQuery2,
  tagTypes: ['trips', 'itineraries', 'trips-id', 'checklists', 'attachments'],
  endpoints: () => ({}),
});
