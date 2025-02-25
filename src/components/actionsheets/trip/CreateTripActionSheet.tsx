import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Icon} from 'react-native-paper';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import DatePicker from 'react-native-date-picker';
import {theme} from '../../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/AppNavigator';
import {useCreateTripPlanMutation} from '../../../redux/slices/tripplan/tripPlanSlice';
import dayjs from 'dayjs';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

interface CreateTripActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
}

const CreateTripActionSheet: React.FC<CreateTripActionSheetProps> = ({
  actionSheetRef,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [createTripPlan] = useCreateTripPlanMutation();
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  
  const imageUrl = () => {
    return `/${Math.floor(Math.random() * 6) + 1}.jpg`;
  };


  const handleCreateTrip = async () => {
    try {
      const tripData = {
        title: tripName,
        destinationName: destination,
        startDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
        endDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : '',
        description: description,
        imageUrl : imageUrl(),
        userId: user?.userId,
        destinationId: 124,
      };

      const response = await createTripPlan(tripData).unwrap();

      console.log('created tripplan : ', response);

      actionSheetRef.current?.hide();

      navigation.push('TripDetails', {
        tripId: response.id,
        trip_id: response.tripId,
      });

      setTripName('');
      setDestination('');
      setFromDate(null);
      setToDate(null);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <ActionSheet ref={actionSheetRef} gestureEnabled>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Create a Trip</Text>

        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Summer vacation in Greece"
          maxLength={80}
          value={tripName}
          onChangeText={setTripName}
        />

        <Text style={styles.label}>Destination</Text>
        <View style={styles.searchContainer}>
          <Icon source="magnify" size={20} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <Text style={styles.label}>Select Date Range</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowFromDate(true)}>
          <Text
            style={[
              styles.datePickerButtonText,
              {color: fromDate || toDate ? 'black' : 'gray'},
            ]}>
            From: {fromDate ? fromDate.toDateString() : 'Select Start Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowToDate(true)}>
          <Text
            style={[
              styles.datePickerButtonText,
              {color: fromDate || toDate ? 'black' : 'gray'},
            ]}>
            To: {toDate ? toDate.toDateString() : 'Select End Date'}
          </Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={showFromDate}
          date={fromDate || new Date()}
          mode="date"
          onConfirm={date => {
            setFromDate(date);
            setShowFromDate(false);
          }}
          onCancel={() => setShowFromDate(false)}
        />
        <DatePicker
          modal
          open={showToDate}
          date={toDate || new Date()}
          mode="date"
          onConfirm={date => {
            setToDate(date);
            setShowToDate(false);
          }}
          onCancel={() => setShowToDate(false)}
        />

        <Text style={styles.label}>Description</Text>
        <View style={styles.descriptionContainer}>
          <TextInput
            style={[styles.searchInput, styles.descriptionInput]}
            placeholder="Add a description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.hide()}
            style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.createButton,
              !tripName.trim() && styles.createButtonDisabled,
            ]}
            onPress={handleCreateTrip}
            disabled={!tripName.trim()}>
            <Text style={styles.createText}>Create Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
};

export default CreateTripActionSheet;

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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    fontSize: 16,
    color: 'gray',
  },
  createButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    padding: 12,
  },
  createButtonDisabled: {
    backgroundColor: 'gray',
  },
  createText: {
    fontSize: 16,
    color: 'white',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
