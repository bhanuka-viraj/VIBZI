import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthState } from '../redux/slices/authSlice';
import HomeScreen from '../screens/HomeScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import MainLayout from '../components/layouts/MainLayout';
import { RootState } from '../redux/store';
import SignupScreen from '../screens/auth/SignupScreen';
import { useAppDispatch } from '../redux/hooks';
import ConfirmSignupScreen from '../screens/auth/ConfirmSignupScreen';
import LoadingScreen from '../components/LoadingScreen';

export type RootStackParamList = {
  Home: undefined;
  MyTrips: undefined;
  Profile: undefined;
  TripDetails: { tripName: string; destination: string; fromDate: Date | null; toDate: Date | null };
  Login: undefined;
  Signup: undefined;
  ConfirmSignup: { username: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const withMainLayout = (Component: React.ComponentType<any>, showHeader: boolean = true) => (props: any) => (
  <MainLayout showHeader={showHeader}>
    <Component {...props} />
  </MainLayout>
);

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);


  if (loading || (isAuthenticated && !user)) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ConfirmSignup" component={ConfirmSignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={withMainLayout(HomeScreen)} />
            <Stack.Screen name="MyTrips" component={withMainLayout(MyTripsScreen)} />
            <Stack.Screen name="Profile" component={withMainLayout(ProfileScreen, false)} />
            <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
