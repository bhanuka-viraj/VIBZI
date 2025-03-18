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
import { useGetTripPlanItineraryByIdQuery } from '../../redux/slices/tripplan/itinerary/itinerarySlice';
import {
  parseTripDate,
  parseItineraryData,
  ItineraryItem,
} from '../../utils/tripUtils/tripDataUtil';
import { setitinerary, setTripDate } from '../../redux/slices/metaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../constants/theme';
import ItineraryOptionsModal from '@/components/modals/ItineraryOptionsModal';
import { THINGSTODO } from '@/constants/ItineraryTypes';

interface ItineraryScreenProps {
  tripId: string;
  trip_id: string;
}

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ tripId, trip_id }) => {
  const theme = useTheme();
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedDate = useSelector((state: any) => state.meta.trip.select_date);
  const tripData = useSelector((state: any) => state.meta.trip);

  const thingsToDoactionSheetRef = useRef<ActionSheetRef>(null);
  const placeToStayactionSheetRef = useRef<ActionSheetRef>(null);
  const foodAndDrinkactionSheetRef = useRef<ActionSheetRef>(null);
  const transportationactionSheetRef = useRef<ActionSheetRef>(null);
  const noteactionSheetRef = useRef<ActionSheetRef>(null);

  const { data, isLoading } = useGetTripPlanItineraryByIdQuery(trip_id as any);
  const { dates, itineraryByDate } = parseItineraryData(data);
  const selectedDateItineraries = itineraryByDate[selectedDate] || [];

  const renderKey = JSON.stringify(selectedDateItineraries);

  const handleLongPress = (item: ItineraryItem) => {
    setSelectedItem(item);
    setIsUpdating(true);
    setModalVisible(true);
  };

  const handleUpdate = () => {
    if (selectedItem?.type === THINGSTODO) {
      thingsToDoactionSheetRef.current?.show();
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    console.log('Delete item:', selectedItem);
    setModalVisible(false);
    setIsUpdating(false);
    setSelectedItem(null);
  };

  const handleAddNewItem = (actionSheetRef: React.RefObject<ActionSheetRef>) => {
    setIsUpdating(false);
    setSelectedItem(null);
    actionSheetRef.current?.show();
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

  // do not uncomment these
  // console.log('data  : ', data);
  // console.log('trip_id : ', trip_id);

  // console.log('dates : ', dates);
  // console.log('itineraryByDate : ', itineraryByDate);
  // console.log('selectedDate : ', selectedDate);
  console.log('selectedDateItineraries : ', selectedDateItineraries);

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
          {selectedDateItineraries.map((item: ItineraryItem, index: number) => (
            <TouchableOpacity
              key={`${selectedDate}-${item.position}`}
              onLongPress={() => handleLongPress(item)}
              activeOpacity={0.8}>
              <ItineraryCard item={item} onPress={() => { }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ItineraryOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <AddThingToDoActionSheet
        actionSheetRef={thingsToDoactionSheetRef}
        initialData={
          selectedItem?.type === THINGSTODO ? selectedItem : undefined
        }
        isUpdating={isUpdating}
      />
      <AddPlaceToStayActionSheet actionSheetRef={placeToStayactionSheetRef} />
      <AddFoodAndDrinkActionSheet actionSheetRef={foodAndDrinkactionSheetRef} />
      <AddTransportationActionSheet
        actionSheetRef={transportationactionSheetRef}
      />
      <NoteActionSheet actionSheetRef={noteactionSheetRef} />

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
