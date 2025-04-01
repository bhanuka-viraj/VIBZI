import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { theme } from '../../../constants/theme';
import { useSelector } from 'react-redux';
import { useUpdateTripPlanItineraryMutation } from '../../../redux/slices/tripplan/itinerary/itinerarySlice';
import { NOTE } from '../../../constants/ItineraryTypes';
import { validateRequiredFields } from '../../../utils/validation/formValidation';

interface NoteActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
  initialData?: {
    position: number;
    date: string;
    type: string;
    details: {
      title: string;
      customFields: {
        note?: string;
      };
    };
  };
  isUpdating: boolean;
  isViewOnly: boolean;
}

const NoteActionSheet: React.FC<NoteActionSheetProps> = ({
  actionSheetRef,
  initialData,
  isUpdating,
  isViewOnly
}) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tripData = useSelector((state: any) => state.meta.trip);
  const itinerary = tripData?.itinerary || null;

  const selectedDate = tripData?.select_date || '';
  const it_id = itinerary?.id || '';

  const [updateItinerary, { isLoading }] = useUpdateTripPlanItineraryMutation();

  const setDefaultValues = () => {
    setTitle('');
    setNote('');
  };

  const handleClear = () => {
    setDefaultValues();
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.details.title || '');
      setNote(initialData.details.customFields?.note || '');
    } else {
      setDefaultValues();
    }
  }, [initialData]);

  useEffect(() => {
    if (!isUpdating && !isViewOnly && !initialData) {
      setDefaultValues();
    }
  }, [isUpdating, isViewOnly, initialData]);

  const validateForm = (): boolean => {
    setErrors({});

    const fieldValidation = validateRequiredFields(
      { note },
      ['note']
    );

    if (!fieldValidation.isValid) {
      setErrors(fieldValidation.errors);
    }

    return fieldValidation.isValid;
  };

  const handleAdd = async () => {
    if (!selectedDate || !itinerary) return;

    if (!validateForm()) {
      return;
    }

    actionSheetRef.current?.hide();

    const obj = {
      position: initialData
        ? initialData.position
        : itinerary.itinerary[selectedDate].length + 1,
      date: selectedDate,
      type: NOTE,
      details: {
        title,
        customFields: {
          note,
        },
      },
    };

    const updatedItinerary = {
      ...itinerary,
      itinerary: {
        ...itinerary.itinerary,
        [selectedDate]: initialData
          ? itinerary.itinerary[selectedDate].map((item: { position: number }) =>
            item.position === initialData.position ? obj : item,
          )
          : [...itinerary.itinerary[selectedDate], obj],
      },
    };

    try {
      await updateItinerary({ id: it_id, data: updatedItinerary }).unwrap();
      handleClear();
    } catch (error) {
      console.log('error : ', error);
    }
  };

  return (
    <ActionSheet ref={actionSheetRef} gestureEnabled>
      <ScrollView
        contentContainerStyle={styles.modalContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {isViewOnly ? 'View Details' : isUpdating ? 'Update Note' : 'Add Note'}
        </Text>

        <Text style={styles.label}>Title (optional)</Text>
        <TextInput
          style={[styles.input, isViewOnly && styles.disabledInput]}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
          editable={!isViewOnly}
        />

        <Text style={styles.label}>Note *</Text>
        <TextInput
          style={[
            styles.input,
            styles.noteInput,
            isViewOnly && styles.disabledInput,
            errors.note && styles.inputError
          ]}
          placeholder="Add note"
          value={note}
          onChangeText={(text) => {
            setNote(text);
            if (errors.note) {
              setErrors({ ...errors, note: '' });
            }
          }}
          multiline
          numberOfLines={3}
          editable={!isViewOnly}
        />
        {errors.note && <Text style={styles.errorText}>{errors.note}</Text>}

        {!isViewOnly && (
          <View style={styles.buttonContainer}>
            {!isUpdating && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.addButton, isUpdating && { flex: 1 }]}
              onPress={() => handleAdd()}>
              <Text style={styles.addText}>{isUpdating ? 'Update' : 'Add to trip'}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default NoteActionSheet;
