import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThingsToDoForm from '../screens/tripdetails/forms/ThingsToDoForm';
import FoodAndDrinkForm from '../screens/tripdetails/forms/FoodAndDrinkForm';
import PlaceToStayForm from '../screens/tripdetails/forms/PlaceToStayForm';
import TransportationForm from '../screens/tripdetails/forms/TransportationForm';
import NoteForm from '../screens/tripdetails/forms/NoteForm';
import ItineraryDetails from '../screens/tripdetails/details/ItineraryDetails';

export type ItineraryStackParamList = {
    ThingsToDo: {
        isViewOnly: boolean;
        isUpdating: boolean;
        initialData: any;
    };
    FoodAndDrink: {
        isViewOnly: boolean;
        isUpdating: boolean;
        initialData: any;
    };
    PlaceToStay: {
        isViewOnly: boolean;
        isUpdating: boolean;
        initialData: any;
    };
    Transportation: {
        isViewOnly: boolean;
        isUpdating: boolean;
        initialData: any;
    };
    Note: {
        isViewOnly: boolean;
        isUpdating: boolean;
        initialData: any;
    };
    ItineraryDetails: {
        item: any;
    };
};

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

const ItineraryStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="ThingsToDo" component={ThingsToDoForm} />
            <Stack.Screen name="FoodAndDrink" component={FoodAndDrinkForm} />
            <Stack.Screen name="PlaceToStay" component={PlaceToStayForm} />
            <Stack.Screen name="Transportation" component={TransportationForm} />
            <Stack.Screen name="Note" component={NoteForm} />
            <Stack.Screen name="ItineraryDetails" component={ItineraryDetails} />
        </Stack.Navigator>
    );
};

export default ItineraryStackNavigator; 