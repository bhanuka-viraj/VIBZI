import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {theme} from '../../../constants/theme';
import {useSelector} from 'react-redux';
import {useUpdateTripPlanItineraryMutation} from '../../../redux/slices/tripplan/itinerary/itinerarySlice';
import {FOODANDDRINK} from '../../../constants/types/ItineraryTypes';

interface FoodAndDrinkActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
}

const AddFoodAndDrinkActionSheet: React.FC<FoodAndDrinkActionSheetProps> = ({
  actionSheetRef,
}) => {
  const [name, setName] = useState('');
  const [isBooked, setIsBooked] = useState<boolean | null>(null);
  const [link, setLink] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [note, setNote] = useState('');

  const tripData = useSelector((state: any) => state.meta.trip);
  const itinerary = tripData?.itinerary || null;

  const selectedDate = tripData?.select_date || '';
  const it_id = itinerary?.id || '';

  const [updateItinerary, {isLoading}] = useUpdateTripPlanItineraryMutation();

  const handleClear = () => {
    setName('');
    setIsBooked(null);
    setLink('');
    setReservationNumber('');
    setNote('');
  };

  const handleAdd = async () => {
    if (!selectedDate || !itinerary) return;

    const obj = {
      position: itinerary.itinerary[selectedDate].length + 1,
      date: selectedDate,
      type: FOODANDDRINK,
      details: {
        title: name,
        customFields: {
          isBooked,
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
    <ActionSheet ref={actionSheetRef} gestureEnabled>
      <ScrollView
        contentContainerStyle={[
          styles.modalContainer,
          {backgroundColor: 'white'},
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Food & Drink</Text>
        <Text style={styles.description}>Add a description here</Text>

        <Text style={styles.label}>Name Of Restaurant *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter activity name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Booked?</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isBooked === true && {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => setIsBooked(true)}>
            <Text
              style={[
                styles.toggleText,
                isBooked === true && {color: theme.colors.onPrimary},
              ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isBooked === false && {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => setIsBooked(false)}>
            <Text
              style={[
                styles.toggleText,
                isBooked === false && {color: theme.colors.onPrimary},
              ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Add booking or information link"
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 20,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
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
    backgroundColor: 'white',
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
  noteInput: {
    height: 100,
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
});

export default AddFoodAndDrinkActionSheet;
