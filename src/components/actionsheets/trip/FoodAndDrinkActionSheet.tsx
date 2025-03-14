import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import DatePicker from 'react-native-date-picker';
import {theme} from '../../../constants/theme';
import {useSelector} from 'react-redux';
import {useUpdateTripPlanItineraryMutation} from '../../../redux/slices/tripplan/itinerary/itinerarySlice';
import {FOODANDDRINK} from '../../../constants/ItineraryTypes';

interface FoodAndDrinkActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
}
//======================================
//made some changes to the code, to fix the keyboard issue (it comes when the keyboard and scrollview are both present)
// compare the code with another actionsheet - others are not changed
//======================================

const AddFoodAndDrinkActionSheet: React.FC<FoodAndDrinkActionSheetProps> = ({
  actionSheetRef,
}) => {
  const [name, setName] = useState('');
  const [isBooked, setIsBooked] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [link, setLink] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [note, setNote] = useState('');

  const tripData = useSelector((state: any) => state.meta.trip);
  const itinerary = tripData?.itinerary || null;

  const selectedDate = tripData?.select_date || '';
  const it_id = itinerary?.id || '';

  const [updateItinerary, {isLoading}] = useUpdateTripPlanItineraryMutation();

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const handleClear = () => {
    setName('');
    setIsBooked(null);
    setStartTime(null);
    setEndTime(null);
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
          startTime,
          endTime,
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

  console.log('actionSheetRef : ', actionSheetRef);

  return (
    <ActionSheet
      ref={actionSheetRef}
      gestureEnabled
      containerStyle={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.9,
      }}
      indicatorStyle={{
        backgroundColor: '#ccc',
      }}>
      <ScrollView
        contentContainerStyle={styles.modalContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
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

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={[styles.timeInput, !startTime && styles.timeInputEmpty]}
              onPress={() => setShowStartPicker(true)}>
              <Text
                style={[
                  styles.timeText,
                  !startTime && styles.timeTextPlaceholder,
                ]}>
                {formatTime(startTime) || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={[styles.timeInput, !endTime && styles.timeInputEmpty]}
              onPress={() => setShowEndPicker(true)}>
              <Text
                style={[
                  styles.timeText,
                  !endTime && styles.timeTextPlaceholder,
                ]}>
                {formatTime(endTime) || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DatePicker
          modal
          open={showStartPicker}
          date={new Date()}
          mode="time"
          onConfirm={date => {
            setStartTime(date);
            setShowStartPicker(false);
          }}
          onCancel={() => setShowStartPicker(false)}
        />

        <DatePicker
          modal
          open={showEndPicker}
          date={new Date()}
          mode="time"
          onConfirm={date => {
            setEndTime(date);
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />

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
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 40,
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
  timeInputEmpty: {
    borderColor: '#ddd',
  },
  timeTextPlaceholder: {
    color: '#999',
  },
});

export default AddFoodAndDrinkActionSheet;
