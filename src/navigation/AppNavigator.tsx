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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainLayout>  
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MyTrips" component={MyTripsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
        </Stack.Navigator>
      </MainLayout>
    </NavigationContainer>
  );
}
