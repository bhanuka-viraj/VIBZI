import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FOODANDDRINK,
  THINGSTODO,
  TRANSPORTATION,
  NOTE,
  PLACESTOSTAY,
} from '../../constants/ItineraryTypes';
import { theme } from '../../constants/theme';
import { parseTime } from '../../utils/tripUtils/tripDataUtil';

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
  onUpdate: (item: any) => void;
  onDelete: (item: any) => void;
  onPress: (item: any) => void;
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

const ItineraryCard: React.FC<ItineraryCardProps> = ({ item, onUpdate, onDelete, onPress }) => {
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

  const handleLinkPress = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.cardContainer,
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
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <View style={styles.leftContent}>
              {getIconByType(item)}
              <Text variant="titleMedium" style={styles.name}>
                {item.details.title}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => onUpdate(item)}
                style={styles.iconButton}
              >
                <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(item)}
                style={styles.iconButton}
              >
                <MaterialIcons name="delete-outline" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
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
          {item.details.customFields.link && (
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => handleLinkPress(item.details.customFields.link || '')}>
              <MaterialIcons name="open-in-new" size={16} color={theme.colors.primary} />
              <Text style={styles.linkText} numberOfLines={1}>
                {item.details.customFields.link.replace(/^https?:\/\//, '')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 2,
    marginBottom: 10,
    backgroundColor: 'transparent',
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 10,
  },
  iconButton: {
    padding: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    marginLeft: 6,
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1,
  },
} as const);

export default ItineraryCard;
