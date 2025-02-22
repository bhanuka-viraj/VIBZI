import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ChecklistsScreen from '../screens/tripdetails/CheckListScreen';
import ItineraryScreen from '../screens/tripdetails/ItineraryScreen';
import AttachmentsScreen from '../screens/tripdetails/AttachmentsScreen';
import {theme} from '../constants/theme';

export type ItineraryScreenProps = {
  dateRange: string[];
};

const Tab = createMaterialTopTabNavigator();

export type TripDetailsTabParams = {
  Checklists: {
    tripId: string;
    trip_id: string;
  };
  Itinerary: {
    tripId: string;
    trip_id: string;
    dateRange: string[];
  };
  Attachments: {
    tripId: string;
    trip_id: string;
  };
};

type TripDetailsTabNavigatorProps = {
  screenProps: {
    dateRange: string[];
    tripId: string;
    trip_id: string;
  };
};

const TripDetailsTabNavigator: React.FC<TripDetailsTabNavigatorProps> = ({
  screenProps,
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: 14,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 3,
        },
        tabBarPressColor: 'transparent',
        swipeEnabled: true,
        lazy: true,
      }}>
      <Tab.Screen
        name="Checklists"
        children={() => (
          <ChecklistsScreen
            tripId={screenProps.tripId}
            trip_id={screenProps.trip_id}
          />
        )}
        options={{tabBarLabel: 'Checklists'}}
      />
      <Tab.Screen
        name="Itinerary"
        children={() => <ItineraryScreen dateRange={screenProps.dateRange} />}
        options={{tabBarLabel: 'Itinerary'}}
      />
      <Tab.Screen
        name="Attachments"
        children={() => <AttachmentsScreen />}
        options={{tabBarLabel: 'Attachments'}}
      />
    </Tab.Navigator>
  );
};

export default TripDetailsTabNavigator;
