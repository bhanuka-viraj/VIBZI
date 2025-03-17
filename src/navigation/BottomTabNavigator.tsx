import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { theme } from '../constants/theme';
import { useRoute } from '@react-navigation/native';
import MainLayout from '../components/layouts/MainLayout';
import { withAuth } from '../utils/withAuth';

const Tab = createBottomTabNavigator();

const withMainLayout =
  (Component: React.ComponentType<any>, showHeader = true) =>
    (props: any) =>
    (
      <MainLayout showHeader={showHeader}>
        <Component {...props} />
      </MainLayout>
    );

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
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

          const icon = options.tabBarIcon({ focused: isFocused });

          return (
            <View key={route.key} style={styles.tab}>
              <Ionicons
                name={icon.props.name}
                size={icon.props.size || 20}
                color={isFocused ? theme.colors.primary : '#909090'}
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
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={20}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyTrips"
          component={withMainLayout(withAuth(MyTripsScreen, 'MyTrips'))}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'map' : 'map-outline'}
                size={20}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={withMainLayout(withAuth(ProfileScreen, 'Profile'), false)}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'person-circle-outline' : 'person-circle-outline'}
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '50%',
    justifyContent: 'space-between',
    borderWidth: 0.2,
    borderColor: '#E0E0E0',
    borderRadius: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default BottomTabNavigator;