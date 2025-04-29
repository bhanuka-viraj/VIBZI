import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThingsToDoForm from '@/screens/tripdetails/forms/ThingsToDoForm';
import ThingsToDoDetails from '@/screens/tripdetails/details/ThingsToDoDetails';

export type ItineraryStackParamList = {
    ThingsToDo: {
        isViewOnly?: boolean;
        isUpdating?: boolean;
        initialData?: any;
    };
    ThingsToDoDetails: {
        item: any;
    };
};

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

const ItineraryStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}>
            <Stack.Screen name="ThingsToDo" component={ThingsToDoForm} />
            <Stack.Screen name="ThingsToDoDetails" component={ThingsToDoDetails} />
        </Stack.Navigator>
    );
};

export default ItineraryStackNavigator; 