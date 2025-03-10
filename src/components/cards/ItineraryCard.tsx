import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FOODANDDRINK,
  THINGSTODO,
  TRANSPORTATION,
  NOTE,
  PLACESTOSTAY,
} from '../../constants/ItineraryTypes';
import {theme} from '../../constants/theme';
import {parseTime} from '../../utils/tripUtils/tripDataUtil';

interface ItineraryCardProps {
  item: {
    position: number;
    date: string;
    type: string;
    details: {
      title: string;
      customFields: {
        activityName?: string;
        booked?: string;
        startTime?: string;
        endTime?: string;
        link?: string;
        reservationNumber?: string;
        note?: string;
        arrivalTime?: string;
        departureTime?: string;
        type?: string;
        departureLocation?: string;
        arrivalLocation?: string;
      };
    };
  };
}

const getIconByType = (item: any) => {
  switch (item.type) {
    case FOODANDDRINK:
      return (
        <MaterialIcons
          name="restaurant"
          size={24}
          color={theme.colors.primary}
        />
      );
    case THINGSTODO:
      return (
        <MaterialIcons name="event" size={24} color={theme.colors.primary} />
      );
    case PLACESTOSTAY:
      return (
        <MaterialIcons name="hotel" size={24} color={theme.colors.primary} />
      );
    case TRANSPORTATION: {
      if (item.details.customFields.type === 'Flight') {
        return (
          <MaterialIcons name="flight" size={24} color={theme.colors.primary} />
        );
      } else if (item.details.customFields.type === 'Train') {
        return (
          <MaterialIcons name="train" size={24} color={theme.colors.primary} />
        );
      } else if (item.details.customFields.type === 'Car') {
        return (
          <MaterialIcons
            name="directions-car"
            size={24}
            color={theme.colors.primary}
          />
        );
      } else {
        return (
          <MaterialIcons
            name="directions-bus"
            size={24}
            color={theme.colors.primary}
          />
        );
      }
    }
    case NOTE:
      return (
        <MaterialIcons name="note" size={24} color={theme.colors.primary} />
      );
    default:
      return null;
  }
};

const ItineraryCard: React.FC<ItineraryCardProps> = ({item}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    animatedValue.setValue(0);

    Animated.sequence([
      Animated.delay(item.position * 100),
      Animated.spring(animatedValue, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      animatedValue.setValue(0);
    };
  }, [item.position]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.6, 0.85, 1],
                outputRange: [0.3, 1.1, 0.95, 1],
              }),
            },
          ],
        },
      ]}>
      <View style={styles.headerContainer}>
        {getIconByType(item)}
        <Text variant="titleMedium" style={styles.name}>
          {item.details.title}
        </Text>
      </View>
      {item.type === TRANSPORTATION ? (
        <>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {item.details.customFields.departureLocation}
            </Text>
            <MaterialIcons
              name="arrow-right-alt"
              size={16}
              color={theme.colors.primary}
              style={styles.arrow}
            />
            <Text style={styles.locationText}>
              {item.details.customFields.arrivalLocation}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {parseTime(item.details.customFields.departureTime || '')} -{' '}
            {parseTime(item.details.customFields.arrivalTime || '')}
          </Text>
        </>
      ) : item.type !== NOTE ? (
        <Text style={styles.timeText}>
          {parseTime(item.details.customFields.startTime || '')} -{' '}
          {parseTime(item.details.customFields.endTime || '')}
        </Text>
      ) : null}
      {item.details.customFields.activityName && (
        <Text>{item.details.customFields.activityName}</Text>
      )}
    </Animated.View>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  arrow: {
    marginTop: 1,
  },
});

export default ItineraryCard;
