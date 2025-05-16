import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  signUp as amplifySignUp,
  fetchUserAttributes,
  fetchAuthSession,
  confirmSignUp as amplifyConfirmSignUp,
  signInWithRedirect,
} from '@aws-amplify/auth';
import {createAsyncThunk} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInitialized: state => {
      state.isInitialized = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(signOut.fulfilled, state => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const {setUser, clearUser, setError, setLoading, setInitialized} =
  authSlice.actions;

////////////////////////////////////////////////////////////
export const checkAuthState = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();

    const session = await fetchAuthSession();
    console.log('User Attributes:', attributes);
    console.log('Session:', session);
    const userObject = {
      username: attributes.email || user.username,
      userId: user.userId,
      firstName: attributes.given_name || 'User',
      lastName: attributes.family_name || '',
      email: attributes.email || '',
      phone: attributes.phone_number || '',
      gender: attributes.gender || '',
      birthdate: attributes.birthdate || '',
      picture: attributes.picture || '',
      isSignedIn: true,
    };
    console.log('User Object:', userObject);
    dispatch(setUser(userObject));
  } catch (error) {
    console.log('Error in checkAuthState:', error);
    dispatch(clearUser());
  } finally {
    dispatch({type: 'auth/setInitialized'});
  }
};

export const signIn =
  (username: string, password: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const signInResult = await amplifySignIn({username, password});
      const userInfo = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      console.log('SignIn User Attributes:', attributes);
      console.log('SignIn User Info:', userInfo);

      const userObject = {
        username: attributes.email || username,
        userId: userInfo.userId,
        firstName: attributes.given_name || 'User',
        lastName: attributes.family_name || '',
        email: attributes.email || '',
        phone: attributes.phone_number || '',
        gender: attributes.gender || '',
        birthdate: attributes.birthdate || '',
        picture: attributes.picture || '',
        isSignedIn: signInResult.isSignedIn,
      };
      console.log('SignIn User Object:', userObject);
      dispatch(setUser(userObject));
    } catch (error: any) {
      if (
        error.message?.includes(
          'User needs to be authenticated to call this API',
        )
      ) {
        dispatch(setError(null));
        return {username};
      }
      dispatch(setError(error.message));
      dispatch(clearUser());
    } finally {
      dispatch(setLoading(false));
    }
  };

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      await amplifySignOut();
      dispatch(clearUser());
      return null;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({
    username,
    password,
    email,
    givenName,
    familyName,
    gender,
    birthdate,
    phoneNumber,
  }: {
    username: string;
    password: string;
    email: string;
    givenName: string;
    familyName: string;
    gender: string;
    birthdate: string;
    phoneNumber: string;
  }) => {
    const result = await amplifySignUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
          given_name: givenName,
          family_name: familyName,
          gender,
          birthdate,
          phone_number: phoneNumber,
        },
      },
    });
    return result;
  },
);

/**
 * Google Sign-In - Handles the OAuth flow for Google authentication
 * Uses Cognito's signInWithRedirect to initiate the Google sign-in process
 * After successful sign-in, fetches user attributes and updates Redux store
 *
 * Flow:
 * 1. Initiates OAuth redirect to Google
 * 2. Waits for redirect completion
 * 3. Fetches user info and attributes
 * 4. Updates Redux store with user data
 */
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const result = await signInWithRedirect({
        provider: 'Google',
        customState: 'google-signin',
      });

      // Wait for the redirect to complete and get the user info
      const userInfo = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      const userObject = {
        username: attributes.email || userInfo.username,
        userId: userInfo.userId,
        firstName: attributes.given_name || 'User',
        lastName: attributes.family_name || '',
        email: attributes.email || '',
        phone: attributes.phone_number || '',
        gender: attributes.gender || '',
        birthdate: attributes.birthdate || '',
        picture: attributes.picture || '',
        isSignedIn: true,
      };

      dispatch(setUser(userObject));
      return userObject;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export default authSlice.reducer;
