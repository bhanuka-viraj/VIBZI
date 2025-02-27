import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ChecklistsScreen from '../screens/tripdetails/CheckListScreen';
import ItineraryScreen from '../screens/tripdetails/ItineraryScreen';
import AttachmentsScreen from '../screens/tripdetails/AttachmentsScreen';
import {theme} from '../constants/theme';

const Tab = createMaterialTopTabNavigator();

// export type TripDetailsTabParams = {
//   Checklists: {
//     tripId: string;
//     trip_id: string;
//   };
//   Itinerary: {
//     tripId: string;
//     trip_id: string;
//     dateRange: string[];
//   };
//   Attachments: {
//     tripId: string;
//     trip_id: string;
//   };
// };

type TripDetailsTabNavigatorProps = {
  screenProps: {
    tripId: string;
    trip_id: string;
  };
};

const TripDetailsTabNavigator: React.FC<TripDetailsTabNavigatorProps> = ({
  screenProps,
}) => {
  return (
    <View style={styles.container}>
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
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
          },
          tabBarPressColor: 'transparent',
          swipeEnabled: false,
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
          children={() => (
            <ItineraryScreen
              tripId={screenProps.tripId}
              trip_id={screenProps.trip_id}
            />
          )}
          options={{
            tabBarLabel: 'Itinerary',
            lazy: true,
          }}
        />
        <Tab.Screen
          name="Attachments"
          children={() => <AttachmentsScreen />}
          options={{tabBarLabel: 'Attachments'}}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default TripDetailsTabNavigator;
