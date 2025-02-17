import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery1 = fetchBaseQuery({ baseUrl: "http://34.162.140.21:8081/api/v1" });
const baseQuery2 = fetchBaseQuery({ baseUrl: "http://34.162.140.21:8082/api/v1" });


export const apiSlice = createApi({
  reducerPath: "apiOne",
  baseQuery:baseQuery1,
  endpoints: () => ({}),
  
});

export const apiSlice1 = createApi({
  reducerPath: "apiTwo" ,
  baseQuery: baseQuery2,
  tagTypes: ["trips","itineraries","trips-id", "checklists","attachments"],
  endpoints: () => ({}),
});


