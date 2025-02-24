import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FOODANDDRINK,
  THINGSTODO,
  TRANSPORTATION,
  NOTE,
  PLACESTOSTAY,
} from '../../constants/types/ItineraryTypes';
import { theme } from '../../constants/theme';

interface ItineraryCardProps {
  item: {
    position: number;
    date: string;
    type: string;
    details: {
      title: string;
      customFields: {
        activityName: string;
        booked: string;
        startTime: string;
        endTime: string;
        link: string;
        reservationNumber: string;
        note: string;
      };
    };
  };
}

const getIconByType = (type: string) => {
  switch (type) {
    case FOODANDDRINK:
      return <MaterialIcons name="restaurant" size={24} color={theme.colors.primary} />;
    case THINGSTODO:
      return <MaterialIcons name="event" size={24} color={theme.colors.primary} />;
    case PLACESTOSTAY:
      return <MaterialIcons name="hotel" size={24} color={theme.colors.primary} />;
    case TRANSPORTATION:
      return <MaterialIcons name="directions-car" color={theme.colors.primary} />;
    case NOTE:
      return <MaterialIcons name="note" size={24} color={theme.colors.primary} />;
    default:
      return null;
  }
};


const ItineraryCard: React.FC<ItineraryCardProps> = ({item}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        {getIconByType(item.type)}
        <Text variant="titleMedium" style={styles.name}>
          {item.details.title}
        </Text>
      </View>
      <Text>{item.details.customFields.activityName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    marginLeft: 10,
    color: '#000',
    fontSize: 18,
  },
});

export default ItineraryCard;
