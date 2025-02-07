import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { Card, Text, useTheme, FAB } from 'react-native-paper';
import { Activity, ItineraryScreenProps } from '../../navigation/TripDetailsTabNavigator';
import AddThingsToDoActionSheet from '../../components/actionsheets/AddThingsToDoActionSheet';
import { ActionSheetRef } from 'react-native-actions-sheet';

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ dateRange, activities }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>(dateRange[0]);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const filteredActivities = activities.filter((activity) => activity.date === selectedDate);

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

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Itinerary
        </Text>

        <View style={styles.itineraryContainer}>
          <Text variant="titleMedium" style={styles.dayHeader}>
            {selectedDate} Activities
          </Text>

          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <Card key={index} style={styles.activityCard}>
                <Card.Content>
                  <Text variant="titleMedium">{activity.time}</Text>
                  <Text variant="titleLarge">{activity.title}</Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                    {activity.location}
                  </Text>
                  {activity.duration && (
                    <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                      {activity.duration}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 20 }}>
              No activities for this date.
            </Text>
          )}
        </View>
      </ScrollView>

      <AddThingsToDoActionSheet actionSheetRef={actionSheetRef} />
      
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
            onPress: () => actionSheetRef.current?.show(),
            style: { elevation: 0, shadowColor: 'transparent',backgroundColor:theme.colors.surface },
          },
          {
            icon: 'home',
            label: 'Add a Place to Stay',
            onPress: () => console.log('Add a Place to Stay'),
            style: { elevation: 0, shadowColor: 'transparent',backgroundColor:theme.colors.surface },
          },
          {
            icon: 'silverware-fork-knife',
            label: 'Add Food & Drink',
            onPress: () => console.log('Add Food & Drink'),
            style: { elevation: 0, shadowColor: 'transparent',backgroundColor:theme.colors.surface },
          },
          {
            icon: 'car',
            label: 'Add Transportation',
            onPress: () => console.log('Add Transportation'),
            style: { elevation: 0, shadowColor: 'transparent',backgroundColor:theme.colors.surface },
          },
          {
            icon: 'note-plus',
            label: 'Add a Note',
            onPress: () => console.log('Add a Note'),
            style: { elevation: 0, shadowColor: 'transparent',backgroundColor:theme.colors.surface },
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
  itineraryContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  activityCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default ItineraryScreen;
