import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChecklistsScreen from '../screens/tripdetailsScreens/CheckListScreen'; 
import ItineraryScreen from '../screens/tripdetailsScreens/ItineraryScreen'; 
import AttachmentsScreen from '../screens/tripdetailsScreens/AttachmentsScreen';
import { theme } from '../constants/theme';

type Activity = {
  time?: string;
  title?: string;
  location?: string;
  image?: string;
  duration?: string;
};
export type { Activity };

type ItineraryScreenProps = {
  dateRange: string[];
  activities: Activity[];
};
export type { ItineraryScreenProps };

const Tab = createMaterialTopTabNavigator();

type TripDetailsTabNavigatorProps = {
  screenProps: ItineraryScreenProps;
};

const TripDetailsTabNavigator: React.FC<TripDetailsTabNavigatorProps> = ({ screenProps }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen name="Checklists" component={ChecklistsScreen} />
      <Tab.Screen name="Itinerary">
        {() => <ItineraryScreen dateRange={screenProps.dateRange} activities={screenProps.activities} />}
      </Tab.Screen>
      <Tab.Screen name="Attachments" component={AttachmentsScreen} />
    </Tab.Navigator>
  );
};

export default TripDetailsTabNavigator;
