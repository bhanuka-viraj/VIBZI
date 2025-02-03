import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '../../constants/theme';

type TripCardType = {
  title: string;
  description: string;
  image: string;
}
export type { TripCardType }

interface TripCardProps {
  trip: {
    title: string;
    description: string;
    image: string;
  };
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: trip.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.textContainer}>
        <Text style={[theme.fonts.titleMedium]}
          numberOfLines={2} // Limit to 2 lines
          ellipsizeMode="tail" // Add ellipsis at the end
        >
          {trip.title}</Text>
        <Text
          style={[theme.fonts.bodyMedium, styles.description]}
          numberOfLines={2} // Limit to 2 lines
          ellipsizeMode="tail" // Add ellipsis at the end
        >
          {trip.description}
        </Text>
      </View>
    </View>
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
    padding: 10,
    height: 150,
  },
  image: {
    width: '40%', 
    height: '100%', 
    borderRadius: 20,
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