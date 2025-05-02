import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theme } from '../../constants/theme';
import { Text } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface TripCardProps {
  trip: {
    title: string;
    description: string;
    image: number;
    id: string;
    tripId: string;
    startDate?: string;
    endDate?: string;
    destinationName?: string;
    imageUrl?: string;
    destinationId?: number;
    userId?: string;
  };
  onPress: (id: string, tripId: string) => void;
  onUpdate: (trip: TripCardProps['trip']) => void;
  onDelete: (trip: TripCardProps['trip']) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress, onUpdate, onDelete }) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.container}
        onPress={() => onPress(trip.id, trip.tripId)}>
        <View style={styles.innerContainer}>
          <Image source={trip.image} style={styles.image} resizeMode="cover" />

          <View style={styles.textContainer}>
            <View style={styles.contentContainer}>
              <Text
                style={[theme.fonts.titleLarge, styles.title]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {trip.title}
              </Text>
              <Text
                style={[theme.fonts.bodyMedium, styles.description]}
                numberOfLines={3}
                ellipsizeMode="tail">
                {trip.description}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onUpdate(trip)}
                style={styles.iconButton}>
                <MaterialIcons name="edit" size={20} color={'#757575'} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onDelete(trip)}
                style={styles.iconButton}>
                <MaterialIcons name="delete-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 60,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    margin: 0,
    marginBottom: 0,
  },
  container: {
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingRight: 8,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  description: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 4,
  },
});
