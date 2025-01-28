// components/BottomNavigation.tsx
import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { theme } from '../constants/theme';
import MyTripsScreen from '../screens/MyTripsScreen';



export default function BottomNav() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', focusedIcon: 'home', unfocusedIcon: 'home' },
    { key: 'myTrips', focusedIcon: 'map', unfocusedIcon: 'map' },
    { key: 'profile', focusedIcon: 'account', unfocusedIcon: 'account' },

  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    myTrips: MyTripsScreen,
    profile: ProfileScreen
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      theme={theme}
      barStyle={{
        backgroundColor: '#ffff',
        paddingBottom: 0,
        height: 60,
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.secondary}
    />
  );
}