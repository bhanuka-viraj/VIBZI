// components/BottomNavigation.tsx
import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';

export default function BottomNav() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const routes = [
    { key: 'Home',  focusedIcon: 'magnify', unfocusedIcon: 'magnify' },
    { key: 'MyTrips',  focusedIcon: 'map', unfocusedIcon: 'map-outline' },
    { key: 'Profile',  focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ];

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
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
        backgroundColor: '#ffff',
        paddingBottom: 0,
        height: 80,
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.secondary}
    />
  );
}