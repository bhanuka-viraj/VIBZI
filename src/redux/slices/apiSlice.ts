import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {fetchAuthSession} from '@aws-amplify/auth';

const baseQuery1 = fetchBaseQuery({
  baseUrl: 'http://service.vibzi.co/api/v1',
});

const baseQuery2 = fetchBaseQuery({
  baseUrl: 'http://35.244.20.26:8082/api/v1',
  prepareHeaders: async headers => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken.toString();

      console.log(token, 'token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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
