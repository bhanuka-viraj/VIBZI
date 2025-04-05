import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthState } from '../redux/slices/authSlice';
import { checkOnboardingStatus } from '../redux/slices/appSlice';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { RootState } from '../redux/store';
import SignupScreen from '../screens/auth/SignupScreen';
import { useAppDispatch } from '../redux/hooks';
import ConfirmSignupScreen from '../screens/auth/ConfirmSignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { StatusBar } from 'react-native';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'white',
    text: '#000000',
    border: 'transparent',
    primary: '#004D40',
  },
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ConfirmSignup: { username: string };
  Main: undefined;
  TripDetails: {
    tripId: string;
    trip_id: string;
  };
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { hasCompletedOnboarding, isLoading: appLoading } = useSelector((state: RootState) => state.app);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(null);

  useEffect(() => {
    dispatch(checkAuthState());
    dispatch(checkOnboardingStatus());
    checkIfFirstLaunch();
  }, [dispatch]);

  const checkIfFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      setIsFirstLaunch(false);
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}>
        {(authLoading || appLoading) ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            {!hasCompletedOnboarding && (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{
                  animation: 'fade',
                  gestureEnabled: false,
                }}
              />
            )}
            {!isAuthenticated ? (
              // Auth Stack
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignupScreen}
                  options={{
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="ConfirmSignup"
                  component={ConfirmSignupScreen}
                  options={{
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPasswordScreen}
                  options={{
                    headerShown: true,
                    headerTitle: '',
                    headerShadowVisible: false,
                    headerTransparent: true,
                    animation: 'slide_from_right',
                    gestureEnabled: false,
                  }}
                />
              </>
            ) : (
              // Main App Stack
              <>
                <Stack.Screen
                  name="Main"
                  component={BottomTabNavigator}
                  options={{
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="TripDetails"
                  component={TripDetailsScreen}
                  options={{
                    gestureEnabled: true,
                  }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
