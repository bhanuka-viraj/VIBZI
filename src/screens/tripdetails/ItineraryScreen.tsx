import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { Text, useTheme, FAB } from 'react-native-paper';
import { ItineraryScreenProps } from '../../navigation/TripDetailsTabNavigator';
import { ActionSheetRef } from 'react-native-actions-sheet';
import AddFoodAndDrinkActionSheet from '../../components/actionsheets/trip/FoodAndDrinkActionSheet';
import AddPlaceToStayActionSheet from '../../components/actionsheets/trip/PlaceToStayActionSheet';
import AddThingToDoActionSheet from '../../components/actionsheets/trip/ThingsToDoActionSheet';
import AddTransportationActionSheet from '../../components/actionsheets/trip/TransportationActionSheet';
import NoteActionSheet from '../../components/actionsheets/trip/NoteActionSheet';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import ItineraryCard from '../../components/cards/ItineraryCard';
import { FOODANDDRINK } from '../../constants/types/ItineraryTypes';

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ dateRange }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>(dateRange[0]);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);

  const thingsToDoactionSheetRef = useRef<ActionSheetRef>(null);
  const placeToStayactionSheetRef = useRef<ActionSheetRef>(null);
  const foodAndDrinkactionSheetRef = useRef<ActionSheetRef>(null);
  const transportationactionSheetRef = useRef<ActionSheetRef>(null);
  const noteactionSheetRef = useRef<ActionSheetRef>(null);

  const foodAndDrinks = useSelector((state: RootState) => state.foodAndDrink.items);

  const itineraryItems = [
    ...foodAndDrinks.map(item => ({ ...item, type: FOODANDDRINK })),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.datesWrapper}>
        <FlatList
          horizontal
          data={dateRange}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.datePill,
                item === selectedDate && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedDate(item)}
            >
              <Text
                style={[
                  styles.dateText,
                  item === selectedDate && { color: theme.colors.onPrimary },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.datesContainer}
        />
      </View>
      
      <View style={{ paddingHorizontal: 10}}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
          Itinerary
      </Text>

      <Text variant="titleMedium" style={styles.dayHeader}>
            {selectedDate} Activities
          </Text>
      </View>

      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.itineraryContainer}>
          {itineraryItems && itineraryItems.map((item, index) => (
          <ItineraryCard key={index} item={item} />
          ))}
          
        </View>
      </ScrollView>


      <AddThingToDoActionSheet actionSheetRef={thingsToDoactionSheetRef} />
      <AddPlaceToStayActionSheet actionSheetRef={placeToStayactionSheetRef} />
      <AddFoodAndDrinkActionSheet actionSheetRef={foodAndDrinkactionSheetRef} />
      <AddTransportationActionSheet actionSheetRef={transportationactionSheetRef} />
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
            onPress: () => thingsToDoactionSheetRef.current?.show(),
            style: { elevation: 0, shadowColor: 'transparent', backgroundColor: theme.colors.surface },
          },
          {
            icon: 'home',
            label: 'Add a Place to Stay',
            onPress: () => placeToStayactionSheetRef.current?.show(),
            style: { elevation: 0, shadowColor: 'transparent', backgroundColor: theme.colors.surface },
          },
          {
            icon: 'silverware-fork-knife',
            label: 'Add Food & Drink',
            onPress: () => foodAndDrinkactionSheetRef.current?.show(),
            style: { elevation: 0, shadowColor: 'transparent', backgroundColor: theme.colors.surface },
          },
          {
            icon: 'car',
            label: 'Add Transportation',
            onPress: () => transportationactionSheetRef.current?.show(),
            style: { elevation: 0, shadowColor: 'transparent', backgroundColor: theme.colors.surface },
          },
          {
            icon: 'note-plus',
            label: 'Add a Note',
            onPress: () => noteactionSheetRef.current?.show(),
            style: { elevation: 0, shadowColor: 'transparent', backgroundColor: theme.colors.surface },
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
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
  sectionTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
  },
  dayHeader: {
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  itineraryContainer:{
    marginBottom: 28
  }

});

export default ItineraryScreen;
