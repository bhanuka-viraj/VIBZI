import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {theme} from '../../../constants/theme';
import {useSelector} from 'react-redux';
import {useUpdateTripPlanItineraryMutation} from '../../../redux/slices/tripplan/itinerary/itinerarySlice';
import {TRANSPORTATION} from '../../../constants/ItineraryTypes';
import DatePicker from 'react-native-date-picker';

interface AddTransportationActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
}

const AddTransportationActionSheet: React.FC<
  AddTransportationActionSheetProps
> = ({actionSheetRef}) => {
  const [type, setType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
  const [link, setLink] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [note, setNote] = useState('');

  // Time picker states
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
  const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);

  const tripData = useSelector((state: any) => state.meta.trip);
  const itinerary = tripData?.itinerary || null;

  const selectedDate = tripData?.select_date || '';
  const it_id = itinerary?.id || '';

  const [updateItinerary, {isLoading}] = useUpdateTripPlanItineraryMutation();

  const handleClear = () => {
    setType(null);
    setName('');
    setDepartureLocation('');
    setDepartureTime(null);
    setArrivalLocation('');
    setArrivalTime(null);
    setLink('');
    setReservationNumber('');
    setNote('');
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const handleAdd = async () => {
    if (!selectedDate || !itinerary) return;

    const obj = {
      position: itinerary.itinerary[selectedDate].length + 1,
      date: selectedDate,
      type: TRANSPORTATION,
      details: {
        title: name,
        customFields: {
          type,
          departureLocation,
          departureTime,
          arrivalLocation,
          arrivalTime,
          link,
          reservationNumber,
          note,
        },
      },
    };

    const updatedItinerary = {
      ...itinerary,
      itinerary: {
        ...itinerary.itinerary,
        [selectedDate]: [...itinerary.itinerary[selectedDate], obj],
      },
    };

    try {
      const res = await updateItinerary({id: it_id, data: updatedItinerary});

      if (res) {
        handleClear();
        actionSheetRef.current?.hide();
      }
    } catch (error) {
      console.log('error : ', error);
    }
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      gestureEnabled
      containerStyle={{
        backgroundColor: 'white',
      }}
      indicatorStyle={{
        backgroundColor: '#ccc',
      }}
      overlayColor="transparent">
      <ScrollView
        contentContainerStyle={styles.modalContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Transportation</Text>
        <Text style={styles.description}>Add a description here</Text>

        <Text style={styles.label}>Type of transportation</Text>
        <View style={styles.toggleContainer}>
          {['Flight', 'Train', 'Car', 'Bus'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.toggleButton,
                type === option && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setType(option)}>
              <Text
                style={[
                  styles.toggleText,
                  type === option && {color: theme.colors.onPrimary},
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Departure Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter departure location"
          value={departureLocation}
          onChangeText={setDepartureLocation}
        />

        <Text style={styles.label}>Arrival Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter arrival location"
          value={arrivalLocation}
          onChangeText={setArrivalLocation}
        />

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.label}>Departure Time</Text>
            <TouchableOpacity
              style={[
                styles.timeInput,
                !departureTime && styles.timeInputEmpty,
              ]}
              onPress={() => setShowDepartureTimePicker(true)}>
              <Text
                style={[
                  styles.timeText,
                  !departureTime && styles.timeTextPlaceholder,
                ]}>
                {formatTime(departureTime) || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.label}>Arrival Time</Text>
            <TouchableOpacity
              style={[styles.timeInput, !arrivalTime && styles.timeInputEmpty]}
              onPress={() => setShowArrivalTimePicker(true)}>
              <Text
                style={[
                  styles.timeText,
                  !arrivalTime && styles.timeTextPlaceholder,
                ]}>
                {formatTime(arrivalTime) || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DatePicker
          modal
          open={showDepartureTimePicker}
          date={new Date()}
          mode="time"
          onConfirm={date => {
            setDepartureTime(date);
            setShowDepartureTimePicker(false);
          }}
          onCancel={() => setShowDepartureTimePicker(false)}
        />

        <DatePicker
          modal
          open={showArrivalTimePicker}
          date={new Date()}
          mode="time"
          onConfirm={date => {
            setArrivalTime(date);
            setShowArrivalTimePicker(false);
          }}
          onCancel={() => setShowArrivalTimePicker(false)}
        />

        <Text style={styles.label}>Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Add link"
          value={link}
          onChangeText={setLink}
        />

        <Text style={styles.label}>Reservation Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reservation number"
          value={reservationNumber}
          onChangeText={setReservationNumber}
        />

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Add any extra details"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAdd()}>
            <Text style={styles.addText}>Add to trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
  },
  clearText: {
    color: '#757575',
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
  },
  addText: {
    color: 'white',
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  timeColumn: {
    flex: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  timeText: {
    fontSize: 16,
  },
  timeInputEmpty: {
    borderColor: '#ddd',
  },
  timeTextPlaceholder: {
    color: '#999',
  },
});

export default AddTransportationActionSheet;
