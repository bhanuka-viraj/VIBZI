import * as React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
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
import {StatusBar} from 'react-native';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
    text: '#000000',
    border: 'transparent',
    primary: '#004D40',
  },
};

export type RootStackParamList = {
  MainTabs: undefined;
  TripDetails: {
    tripId: string;
    trip_id: string;
  };
  Login: {
    redirectTo?: string;
  };
  Signup: undefined;
  ConfirmSignup: {username: string};
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
          navigationBarColor: 'transparent',
          contentStyle: {backgroundColor: '#FFFFFF'},
        }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
        <Stack.Group
          screenOptions={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
            contentStyle: {backgroundColor: 'transparent'},
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ConfirmSignup" component={ConfirmSignupScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
