import * as React from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import ChecklistsScreen from '../screens/tripdetails/CheckListScreen';
import ItineraryScreen from '../screens/tripdetails/ItineraryScreen';
import AttachmentsScreen from '../screens/tripdetails/AttachmentsScreen';
import { theme } from '../constants/theme';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

type TripDetailsTabParams = {
  Checklists: {
    tripId: string;
    trip_id: string;
  };
  Itinerary: {
    tripId: string;
    trip_id: string;
  };
  Attachments: undefined;
};

const Tab = createMaterialTopTabNavigator<TripDetailsTabParams>();

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
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  const ChecklistsComponent = React.useCallback(() => (
    <ChecklistsScreen
      tripId={screenProps.tripId}
      trip_id={screenProps.trip_id}
    />
  ), [screenProps.tripId, screenProps.trip_id]);

  const ItineraryComponent = React.useCallback(() => (
    <ItineraryScreen
      tripId={screenProps.tripId}
      trip_id={screenProps.trip_id}
    />
  ), [screenProps.tripId, screenProps.trip_id]);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Itinerary"
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
        }}>
        <Tab.Screen
          name="Checklists"
          component={ChecklistsComponent}
          options={{ tabBarLabel: 'Checklists' }}
        />
        <Tab.Screen
          name="Itinerary"
          component={ItineraryComponent}
          options={{
            tabBarLabel: 'Itinerary',
          }}
        />
        <Tab.Screen
          name="Attachments"
          component={AttachmentsScreen}
          options={{ tabBarLabel: 'Attachments' }}
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
