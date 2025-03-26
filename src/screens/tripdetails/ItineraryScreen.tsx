import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, useTheme, FAB, ActivityIndicator } from 'react-native-paper';
import { ActionSheetRef } from 'react-native-actions-sheet';
import AddFoodAndDrinkActionSheet from '../../components/actionsheets/trip/FoodAndDrinkActionSheet';
import AddPlaceToStayActionSheet from '../../components/actionsheets/trip/PlaceToStayActionSheet';
import AddThingToDoActionSheet from '../../components/actionsheets/trip/ThingsToDoActionSheet';
import AddTransportationActionSheet from '../../components/actionsheets/trip/TransportationActionSheet';
import NoteActionSheet from '../../components/actionsheets/trip/NoteActionSheet';
import ItineraryCard from '../../components/cards/ItineraryCard';
import { useGetTripPlanItineraryByIdQuery, useUpdateTripPlanItineraryMutation } from '../../redux/slices/tripplan/itinerary/itinerarySlice';
import {
  parseTripDate,
  parseItineraryData,
  ItineraryItem,
} from '../../utils/tripUtils/tripDataUtil';
import { setitinerary, setTripDate } from '../../redux/slices/metaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../constants/theme';
import { THINGSTODO, PLACESTOSTAY, FOODANDDRINK, TRANSPORTATION, NOTE } from '@/constants/ItineraryTypes';
import ConfirmationDialog from '../../components/ConfirmationDialog';

interface ItineraryScreenProps {
  tripId: string;
  trip_id: string;
}

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ tripId, trip_id }) => {
  const theme = useTheme();
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItineraryItem | null>(null);

  const selectedDate = useSelector((state: any) => state.meta.trip.select_date);
  const tripData = useSelector((state: any) => state.meta.trip);
  const itinerary = tripData?.itinerary || null;
  const it_id = itinerary?.id || '';

  const [updateItinerary] = useUpdateTripPlanItineraryMutation();

  const thingsToDoactionSheetRef = useRef<ActionSheetRef>(null);
  const placeToStayactionSheetRef = useRef<ActionSheetRef>(null);
  const foodAndDrinkactionSheetRef = useRef<ActionSheetRef>(null);
  const transportationactionSheetRef = useRef<ActionSheetRef>(null);
  const noteactionSheetRef = useRef<ActionSheetRef>(null);

  const { data, isLoading } = useGetTripPlanItineraryByIdQuery(trip_id as any);
  const { dates, itineraryByDate } = parseItineraryData(data);
  const selectedDateItineraries = itineraryByDate[selectedDate] || [];

  const renderKey = JSON.stringify(selectedDateItineraries);

  const handleCardPress = (item: ItineraryItem) => {
    setSelectedItem(item);
    setIsViewOnly(true);
    setIsUpdating(false);

    switch (item.type) {
      case THINGSTODO:
        thingsToDoactionSheetRef.current?.show();
        break;
      case PLACESTOSTAY:
        placeToStayactionSheetRef.current?.show();
        break;
      case FOODANDDRINK:
        foodAndDrinkactionSheetRef.current?.show();
        break;
      case TRANSPORTATION:
        transportationactionSheetRef.current?.show();
        break;
      case NOTE:
        noteactionSheetRef.current?.show();
        break;
    }
  };

  const handleUpdate = (item: ItineraryItem) => {
    setSelectedItem(item);
    setIsUpdating(true);
    setIsViewOnly(false);

    switch (item.type) {
      case THINGSTODO:
        thingsToDoactionSheetRef.current?.show();
        break;
      case PLACESTOSTAY:
        placeToStayactionSheetRef.current?.show();
        break;
      case FOODANDDRINK:
        foodAndDrinkactionSheetRef.current?.show();
        break;
      case TRANSPORTATION:
        transportationactionSheetRef.current?.show();
        break;
      case NOTE:
        noteactionSheetRef.current?.show();
        break;
    }
  };

  const handleDelete = async (item: ItineraryItem) => {
    if (!selectedDate || !itinerary) return;

    try {
      const updatedItinerary = {
        ...itinerary,
        itinerary: {
          ...itinerary.itinerary,
          [selectedDate]: itinerary.itinerary[selectedDate].filter(
            (i: ItineraryItem) => i.position !== item.position
          ),
        },
      };
      await updateItinerary({ id: it_id, data: updatedItinerary }).unwrap();
      setIsUpdating(false);
      setSelectedItem(null);
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

  const handleAddNewItem = (actionSheetRef: React.RefObject<ActionSheetRef>) => {
    setIsUpdating(false);
    setIsViewOnly(false);
    setSelectedItem(null);
    actionSheetRef.current?.show();
  };

  const handleDeletePress = (item: ItineraryItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await handleDelete(itemToDelete);
    setItemToDelete(null);
  };

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      dispatch(setTripDate(dates[0]));
    }
    if (data) {
      dispatch(setitinerary(data));
    }
  }, [data, dates, selectedDate, dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(setTripDate(dates[0]));
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container]} key={renderKey}>
      <View style={styles.datesWrapper}>
        <FlatList
          horizontal
          data={dates}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.datePill,
                item === selectedDate && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => dispatch(setTripDate(item))}>
              <Text
                style={[
                  styles.dateText,
                  item === selectedDate && { color: theme.colors.onPrimary },
                ]}>
                {parseTripDate(item)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.datesContainer}
        />
      </View>

      <View style={{ paddingHorizontal: 10 }}>
        <Text variant="titleMedium" style={styles.dayHeader}>
          {parseTripDate(selectedDate)}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.itineraryContainer}>
          {selectedDateItineraries.map((item: ItineraryItem) => (
            <ItineraryCard
              key={`${selectedDate}-${item.position}`}
              item={item}
              onUpdate={handleUpdate}
              onDelete={() => handleDeletePress(item)}
              onPress={handleCardPress}
            />
          ))}
        </View>
      </ScrollView>

      <AddThingToDoActionSheet
        actionSheetRef={thingsToDoactionSheetRef}
        initialData={
          selectedItem?.type === THINGSTODO ? selectedItem : undefined
        }
        isUpdating={isUpdating}
        isViewOnly={isViewOnly}
      />
      <AddPlaceToStayActionSheet
        actionSheetRef={placeToStayactionSheetRef}
        initialData={
          selectedItem?.type === PLACESTOSTAY ? selectedItem : undefined
        }
        isUpdating={isUpdating}
        isViewOnly={isViewOnly}
      />
      <AddFoodAndDrinkActionSheet
        actionSheetRef={foodAndDrinkactionSheetRef}
        initialData={
          selectedItem?.type === FOODANDDRINK ? selectedItem : undefined
        }
        isUpdating={isUpdating}
        isViewOnly={isViewOnly}
      />
      <AddTransportationActionSheet
        actionSheetRef={transportationactionSheetRef}
        initialData={
          selectedItem?.type === TRANSPORTATION ? selectedItem : undefined
        }
        isUpdating={isUpdating}
        isViewOnly={isViewOnly}
      />
      <NoteActionSheet
        actionSheetRef={noteactionSheetRef}
        initialData={
          selectedItem?.type === NOTE ? selectedItem : undefined
        }
        isUpdating={isUpdating}
        isViewOnly={isViewOnly}
      />

      <FAB.Group
        visible={true}
        open={isFabOpen}
        icon={isFabOpen ? 'close' : 'plus'}
        color="white"
        fabStyle={{
          backgroundColor: theme.colors.primary,
          bottom: 20,
          elevation: 0,
          shadowColor: 'transparent',
        }}
        actions={[
          {
            icon: 'format-list-bulleted',
            label: 'Add Things To Do',
            onPress: () => handleAddNewItem(thingsToDoactionSheetRef),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'home',
            label: 'Add a Place to Stay',
            onPress: () => handleAddNewItem(placeToStayactionSheetRef),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'silverware-fork-knife',
            label: 'Add Food & Drink',
            onPress: () => handleAddNewItem(foodAndDrinkactionSheetRef),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'car',
            label: 'Add Transportation',
            onPress: () => handleAddNewItem(transportationactionSheetRef),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'note-plus',
            label: 'Add a Note',
            onPress: () => handleAddNewItem(noteactionSheetRef),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}
      />

      <ConfirmationDialog
        visible={!!itemToDelete}
        onDismiss={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  datesWrapper: {
    paddingVertical: 10,
  },
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 10,
  },
  datePill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayHeader: {
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  itineraryContainer: {
    marginBottom: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ItineraryScreen;
