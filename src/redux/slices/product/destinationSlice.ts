import { apiSlice } from "../../slices/apiSlice";

export const destinationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    suggestDestination: builder.query({
      query: (keyword) => ({
        url: `/provider-service/product/search-destinations?text=${keyword}`,
        method: "GET",
      }),
    }),
    popularDestination:builder.query({
      query: () => ({
        url: `/provider-service/destinations`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSuggestDestinationQuery, usePopularDestinationQuery } = destinationSlice;
