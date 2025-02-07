import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { ItineraryScreenProps } from '../../navigation/TripDetailsTabNavigator';

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ dateRange, activities }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.datesWrapper}>
        <FlatList
          horizontal
          data={dateRange}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.datePill,
                index === 0 && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.dateText,
                  index === 0 && { color: theme.colors.onPrimary },
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
        contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Itinerary
        </Text>

        <View style={styles.itineraryContainer}>
          <Text variant="titleMedium" style={styles.dayHeader}>
            Monday, {dateRange[0]}
          </Text>

          {activities.map((activity, index) => (
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
          ))}
        </View>
      </ScrollView>
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
    flex: 1, // Allows scrolling within available space
  },
  datesWrapper: {
    paddingVertical: 10,
  },
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 10
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
