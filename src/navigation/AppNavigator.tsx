import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import MainLayout from '../components/layouts/MainLayout';

export type RootStackParamList = {
  Home: undefined;
  MyTrips: undefined;
  Profile: undefined;
  TripDetails: { tripName: string; destination: string; fromDate: Date | null; toDate: Date | null };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const withMainLayout = (Component: React.ComponentType<any>, showHeader: boolean = true) => (props: any) => (
  <MainLayout showHeader={showHeader}>
    <Component {...props} />
  </MainLayout>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="Home" component={withMainLayout(HomeScreen)} />
        <Stack.Screen name="MyTrips" component={withMainLayout(MyTripsScreen)} />
        <Stack.Screen name="Profile" component={withMainLayout(ProfileScreen, false)} />
        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
