import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {checkAuthState} from '../redux/slices/authSlice';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import {RootState} from '../redux/store';
import SignupScreen from '../screens/auth/SignupScreen';
import {useAppDispatch} from '../redux/hooks';
import ConfirmSignupScreen from '../screens/auth/ConfirmSignupScreen';
import LoadingScreen from '../components/LoadingScreen';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  Home: undefined;
  MyTrips: undefined;
  Profile: undefined;
  TripDetails: {
    tripId: string;
    trip_id: string;
  };
  Login: undefined;
  Signup: undefined;
  ConfirmSignup: {username: string};
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const {isAuthenticated, loading, user} = useSelector(
    (state: RootState) => state.auth,
  );

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
        }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name="ConfirmSignup"
              component={ConfirmSignupScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
