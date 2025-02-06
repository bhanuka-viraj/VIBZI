import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { ItineraryScreenProps } from '../../navigation/TripDetailsTabNavigator';


const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ dateRange, activities }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={dateRange}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.datePill, index === 0 && { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.dateText, index === 0 && { color: theme.colors.onPrimary }]}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.datesContainer}
      />

      <Text variant="titleLarge" style={styles.sectionTitle}>Itinerary</Text>
      <View style={styles.itineraryContainer}>
        <Text variant="titleMedium" style={styles.dayHeader}>Monday, {dateRange[0]}</Text>
        {activities.map((activity, index) => (
          <Card key={index} style={styles.activityCard}>
            <Card.Content>
              <Text variant="titleMedium">{activity.time}</Text>
              <Text variant="titleLarge">{activity.title}</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>{activity.location}</Text>
              {activity.duration && <Text variant="bodySmall" style={{ color: theme.colors.primary }}>{activity.duration}</Text>}
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: 16,
  },
  datesContainer: {
    marginVertical: 8,
    paddingBottom: 8,
  },
  datePill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  dateText: {
    color: "#666",
  },
  sectionTitle: {
    marginVertical: 16,
  },
  itineraryContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    marginBottom: 12,
  },
  activityCard: {
    marginBottom: 12,
  },
});

export default ItineraryScreen;
