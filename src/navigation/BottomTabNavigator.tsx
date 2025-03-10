import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {theme} from '../constants/theme';
import {useRoute} from '@react-navigation/native';
import MainLayout from '../components/layouts/MainLayout';

const Tab = createBottomTabNavigator();

const withMainLayout =
  (Component: React.ComponentType<any>, showHeader = true) =>
  (props: any) =>
    (
      <MainLayout showHeader={showHeader}>
        <Component {...props} />
      </MainLayout>
    );

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View key={route.key} style={styles.tab}>
              <MaterialCommunityIcons
                name={options.tabBarIcon({focused: isFocused}).props.name}
                size={24}
                color={isFocused ? theme.colors.primary : '#757575'}
                onPress={onPress}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const BottomTabNavigator = () => {
  const route = useRoute();
  // Don't show the tab bar on the TripDetails screen
  const isTabBarVisible = route.name !== 'TripDetails';

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        tabBar={props =>
          isTabBarVisible ? <CustomTabBar {...props} /> : null
        }>
        <Tab.Screen
          name="Home"
          component={withMainLayout(HomeScreen)}
          options={{
            tabBarIcon: ({focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'magnify' : 'magnify'}
                size={24}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyTrips"
          component={withMainLayout(MyTripsScreen)}
          options={{
            tabBarIcon: ({focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'map' : 'map-outline'}
                size={24}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={withMainLayout(ProfileScreen, false)}
          options={{
            tabBarIcon: ({focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                size={24}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '60%',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default BottomTabNavigator;
