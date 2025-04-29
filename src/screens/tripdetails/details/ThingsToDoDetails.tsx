import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItineraryStackParamList } from '../../../navigation/ItineraryStackNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ThingsToDoDetailsRouteProp = RouteProp<ItineraryStackParamList, 'ThingsToDoDetails'>;

const ThingsToDoDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ThingsToDoDetailsRouteProp>();
  const { item } = route.params;

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <IconButton
              icon="arrow-left"
              iconColor={theme.colors.primary}
              size={24}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          <View style={styles.headerContainer}>
            <MaterialCommunityIcons name="format-list-checks" size={24} color="#000" />
            <Text style={styles.headerText}>Things to do</Text>
          </View>

          <Text style={styles.title}>{item.details.title}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="bookmark-check" size={20} color="#666" />
                <Text style={styles.label}>Booking Status</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.details.customFields?.isBooked ? theme.colors.primary : '#f5f5f5' }]}>
                <Text style={[styles.statusText, { color: item.details.customFields?.isBooked ? theme.colors.onPrimary : '#666' }]}>
                  {item.details.customFields?.isBooked ? 'Booked' : 'Not Booked'}
                </Text>
              </View>
            </View>

            {(item.details.customFields?.startTime || item.details.customFields?.endTime) && (
              <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                  <Text style={styles.label}>Time</Text>
                </View>
                <Text style={styles.value}>
                  {formatTime(item.details.customFields?.startTime)} - {formatTime(item.details.customFields?.endTime)}
                </Text>
              </View>
            )}

            {item.details.customFields?.link && (
              <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons name="link" size={20} color="#666" />
                  <Text style={styles.label}>Link</Text>
                </View>
                <Text style={[styles.value, styles.link]} numberOfLines={1}>
                  {item.details.customFields.link}
                </Text>
              </View>
            )}

            {item.details.customFields?.reservationNumber && (
              <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons name="ticket-confirmation" size={20} color="#666" />
                  <Text style={styles.label}>Reservation Number</Text>
                </View>
                <Text style={styles.value}>{item.details.customFields.reservationNumber}</Text>
              </View>
            )}

            {item.details.customFields?.note && (
              <View style={styles.noteContainer}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons name="note-text" size={20} color="#666" />
                  <Text style={styles.label}>Notes</Text>
                </View>
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>{item.details.customFields.note}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    margin: 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  detailsContainer: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  link: {
    color: '#004D40',
    textDecorationLine: 'underline',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noteContainer: {
    gap: 12,
  },
  noteBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default ThingsToDoDetails;