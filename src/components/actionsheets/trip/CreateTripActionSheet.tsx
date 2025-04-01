import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-paper';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import DatePicker from 'react-native-date-picker';
import { theme } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useCreateTripPlanMutation, useUpdateTripPlanMutation } from '../../../redux/slices/tripplan/tripPlanSlice';
import { useSuggestDestinationQuery } from '../../../redux/slices/product/destinationSlice';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

interface CreateTripActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
  isUpdating?: boolean;
  initialData?: any;
}

const CreateTripActionSheet: React.FC<CreateTripActionSheetProps> = ({
  actionSheetRef,
  isUpdating = false,
  initialData,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [createTripPlan] = useCreateTripPlanMutation();
  const [updateTripPlan] = useUpdateTripPlanMutation();
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [dateError, setDateError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const { data: suggestionsData, isFetching: isFetchingSuggestions } = useSuggestDestinationQuery(searchTerm || undefined, {
    skip: !searchTerm || searchTerm.length < 2,
  });

  useEffect(() => {
    console.log('Search Term:', searchTerm);
    console.log('Is Fetching Suggestions:', isFetchingSuggestions);
    console.log('Suggestions Data:', suggestionsData);
  }, [searchTerm, suggestionsData, isFetchingSuggestions]);

  useEffect(() => {
    if (isUpdating && initialData) {
      setTripName(initialData.title || '');
      setDestination(initialData.destinationName || '');
      setDescription(initialData.description || '');
      setFromDate(initialData.startDate ? new Date(initialData.startDate) : null);
      setToDate(initialData.endDate ? new Date(initialData.endDate) : null);
    } else {
      setTripName('');
      setDestination('');
      setDescription('');
      setFromDate(null);
      setToDate(null);
    }
  }, [isUpdating, initialData]);

  const imageUrl = () => {
    return `/${Math.floor(Math.random() * 6) + 1}.jpg`;
  };

  const handleDestinationChange = (text: string) => {
    console.log('Destination text changed:', text);
    setDestination(text);
    setSearchTerm(text);
    setShowSuggestions(true);
    setSelectedDestinationId(null);
  };

  const handleSelectDestination = (name: string, id: number) => {
    setDestination(name);
    setSelectedDestinationId(id);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  const handleSubmit = async () => {
    if (!selectedDestinationId && !isUpdating) {
      console.error('Please select a destination from the suggestions');
      return;
    }

    try {
      actionSheetRef.current?.hide();

      const baseData = {
        title: tripName,
        destinationName: destination,
        startDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
        endDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : '',
        description: description,
        userId: user?.userId,
        destinationId: selectedDestinationId || 124,
      };

      console.log('API Request Data:', baseData);

      let response;
      if (isUpdating) {
        console.log('Updating trip with ID:', initialData.id);
        response = await updateTripPlan({
          id: initialData.id,
          data: {
            ...baseData,
            id: initialData.id,
            tripId: initialData.tripId,
            imageUrl: initialData.imageUrl,
          },
        }).unwrap();
        console.log('Update Response:', response);
      } else {
        console.log('Creating new trip');
        response = await createTripPlan({
          ...baseData,
          imageUrl: imageUrl(),
        }).unwrap();
        console.log('Create Response:', response);
      }

      if (!isUpdating) {
        console.log('Navigating to trip details:', {
          tripId: response.id,
          trip_id: response.tripId,
        });
        navigation.push('TripDetails', {
          tripId: response.id,
          trip_id: response.tripId,
        });
      }

      setTripName('');
      setDestination('');
      setFromDate(null);
      setToDate(null);
      setDescription('');
    } catch (error) {
      console.error('Failed to handle trip:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
  };

  const handleToDateChange = (date: Date) => {
    setToDate(date);
    setShowToDate(false);
    if (fromDate && date < fromDate) {
      setDateError('End date must be after start date');
    } else {
      setDateError('');
    }
  };

  const handleFromDateChange = (date: Date) => {
    setFromDate(date);
    setShowFromDate(false);
    if (toDate && date > toDate) {
      setDateError('End date must be after start date');
    } else {
      setDateError('');
    }
  };

  return (
    <ActionSheet ref={actionSheetRef} gestureEnabled>
      <View style={styles.modalContainer}>
        <ScrollView>
          <Text style={styles.title}>{isUpdating ? 'Update Trip' : 'Create a Trip'}</Text>

          <Text style={styles.label}>Trip Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Summer vacation in Greece"
            maxLength={80}
            value={tripName}
            onChangeText={setTripName}
          />

          <Text style={styles.label}>Destination *</Text>
          <View style={styles.searchContainerWrapper}>
            <View style={styles.searchContainer}>
              <Icon source="magnify" size={20} color="gray" />
              <TextInput
                style={styles.searchInput}
                placeholder="Where to?"
                value={destination}
                onChangeText={handleDestinationChange}
                onFocus={() => setShowSuggestions(true)}
              />
            </View>
            {showSuggestions && suggestionsData?.data && suggestionsData.data.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {suggestionsData.data.slice(0, 5).map((suggestion: any) => (
                  <TouchableOpacity
                    key={suggestion.destinationId}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectDestination(suggestion.name, suggestion.destinationId)}
                    activeOpacity={0.7}>
                    <Text style={styles.suggestionText}>{suggestion.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {!isUpdating && (
            <>
              <Text style={styles.label}>Select Date Range *</Text>
              <TouchableOpacity
                style={[styles.datePickerButton, dateError ? styles.inputError : null]}
                onPress={() => setShowFromDate(true)}>
                <Text
                  style={[
                    styles.datePickerButtonText,
                    { color: fromDate || toDate ? 'black' : 'gray' },
                  ]}>
                  From: {fromDate ? fromDate.toDateString() : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.datePickerButton, dateError ? styles.inputError : null]}
                onPress={() => setShowToDate(true)}>
                <Text
                  style={[
                    styles.datePickerButtonText,
                    { color: fromDate || toDate ? 'black' : 'gray' },
                  ]}>
                  To: {toDate ? toDate.toDateString() : 'Select End Date'}
                </Text>
              </TouchableOpacity>
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

              <DatePicker
                modal
                open={showFromDate}
                date={fromDate || new Date()}
                mode="date"
                onConfirm={handleFromDateChange}
                onCancel={() => setShowFromDate(false)}
              />
              <DatePicker
                modal
                open={showToDate}
                date={toDate || new Date()}
                mode="date"
                onConfirm={handleToDateChange}
                onCancel={() => setShowToDate(false)}
              />
            </>
          )}

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
                (!tripName.trim() || !destination.trim() || (!isUpdating && (!fromDate || !toDate || !!dateError))) && styles.createButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!tripName.trim() || !destination.trim() || (!isUpdating && (!fromDate || !toDate || !!dateError))}>
              <Text style={styles.createText}>{isUpdating ? 'Update Trip' : 'Create Trip'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  searchContainerWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    backgroundColor: 'white',
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
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginTop: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});
