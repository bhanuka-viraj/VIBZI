// components/BottomNavigation.tsx
import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../constants/theme';

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  const routes = [
    { key: 'Home', focusedIcon: 'magnify', unfocusedIcon: 'magnify' },
    { key: 'MyTrips', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
    { key: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ];

  // Get current index based on active route, default to MyTrips tab for TripDetails screen
  const index = route.name === 'TripDetails' 
    ? routes.findIndex(r => r.key === 'MyTrips')
    : routes.findIndex(r => r.key === route.name);

  const handleIndexChange = (newIndex: number) => {
    const route = routes[newIndex];
    navigation.navigate(route.key as never);
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={() => null}
      theme={theme}
      barStyle={{
        backgroundColor: '#fff',
        height: 60,
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.secondary}
    />
  );
}