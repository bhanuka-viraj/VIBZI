import { apiSlice1 } from "../slices/apiSlice";

interface ConsentResponse {
  consent: "AGREED" | "DISAGREED" | "PENDING";
}

interface ConsentRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  consent: "AGREED";
}

export const consentSlice = apiSlice1.injectEndpoints({
  endpoints: (builder) => ({
    getUserConsent: builder.query<ConsentResponse, string>({
      query: (userId) => ({
        url: `/common-service/user-consent/${userId}`,
        method: "GET",
      }),
    }),
    submitUserConsent: builder.mutation<void, ConsentRequest>({
      query: (body) => ({
        url: "/common-service/user-consent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetUserConsentQuery, useSubmitUserConsentMutation } =
  consentSlice;
