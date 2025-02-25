import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {theme} from '../../constants/theme';
import {Text} from 'react-native-paper';

interface TripCardProps {
  trip: {
    title: string;
    description: string;
    image: number;
    id: string;
    tripId: string;
  };
  onPress: (id: string, tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({trip, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(trip.id, trip.tripId)}>
      <Image source={trip.image} style={styles.image} resizeMode="cover" />

      <View style={styles.textContainer}>
        <Text
          style={[theme.fonts.titleMedium]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {trip.title}
        </Text>
        <Text
          style={[theme.fonts.bodyMedium, styles.description]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {trip.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#757575',
    borderRadius: 20,
    marginBottom: 10,
    padding: 8,
    height: 150,
  },
  image: {
    width: '40%',
    height: '100%',
    borderRadius: 10,
  },
  textContainer: {
    width: '55%',
    height: '100%',
    justifyContent: 'center',
  },
  description: {
    marginTop: 5,
  },
});
