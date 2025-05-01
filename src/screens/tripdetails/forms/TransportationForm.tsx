import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateTripPlanItineraryMutation } from '../../../redux/slices/tripplan/itinerary/itinerarySlice';
import { TRANSPORTATION } from '@/constants/ItineraryTypes';
import Toast from 'react-native-toast-message';
import { ItineraryStackParamList } from '../../../navigation/ItineraryStackNavigator';
import DatePicker from 'react-native-date-picker';
import { validateTimeRange, validateRequiredFields } from '../../../utils/validation/formValidation';
import { SafeAreaView } from 'react-native-safe-area-context';

type TransportationScreenRouteProp = RouteProp<ItineraryStackParamList, 'Transportation'>;

const TransportationForm = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute<TransportationScreenRouteProp>();
    const { isViewOnly = false, isUpdating = false, initialData } = route.params;
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [departureLocation, setDepartureLocation] = useState('');
    const [departureTime, setDepartureTime] = useState<Date | null>(null);
    const [arrivalLocation, setArrivalLocation] = useState('');
    const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
    const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
    const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);
    const [link, setLink] = useState('');
    const [reservationNumber, setReservationNumber] = useState('');
    const [note, setNote] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [timeError, setTimeError] = useState<string | undefined>();

    const selectedDate = useSelector((state: any) => state.meta.trip.select_date);
    const tripData = useSelector((state: any) => state.meta.trip);
    const itinerary = tripData?.itinerary || null;
    const it_id = itinerary?.id || '';

    const [updateItinerary, { isLoading }] = useUpdateTripPlanItineraryMutation();

    const formatTime = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const setDefaultValues = () => {
        const now = new Date();
        setName('');
        setType('Car'); // Default to Car
        setDepartureLocation('');
        setDepartureTime(now);
        setArrivalLocation('');
        setArrivalTime(now);
        setLink('');
        setReservationNumber('');
        setNote('');
    };

    const handleClear = () => {
        setDefaultValues();
    };

    useEffect(() => {
        if (initialData) {
            setName(initialData.details.title || '');
            setType(initialData.details.customFields?.type || '');
            setDepartureLocation(initialData.details.customFields?.departureLocation || '');
            setArrivalLocation(initialData.details.customFields?.arrivalLocation || '');

            if (initialData.details.customFields?.departureTime) {
                const departureTimeDate = new Date(initialData.details.customFields.departureTime);
                setDepartureTime(isNaN(departureTimeDate.getTime()) ? null : departureTimeDate);
            } else {
                setDepartureTime(null);
            }
            if (initialData.details.customFields?.arrivalTime) {
                const arrivalTimeDate = new Date(initialData.details.customFields.arrivalTime);
                setArrivalTime(isNaN(arrivalTimeDate.getTime()) ? null : arrivalTimeDate);
            } else {
                setArrivalTime(null);
            }

            setLink(initialData.details.customFields?.link || '');
            setReservationNumber(initialData.details.customFields?.reservationNumber || '');
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
        setTimeError(undefined);

        const fieldValidation = validateRequiredFields(
            {
                name,
                type,
                departureLocation,
                arrivalLocation
            },
            ['name', 'type', 'departureLocation', 'arrivalLocation']
        );

        const timeValidation = validateTimeRange(departureTime, arrivalTime);

        if (!fieldValidation.isValid) {
            setErrors(fieldValidation.errors);
        }

        if (!timeValidation.isValid) {
            setTimeError(timeValidation.error);
        }

        return fieldValidation.isValid && timeValidation.isValid;
    };

    const handleSave = async () => {
        if (!selectedDate || !itinerary) return;

        if (!validateForm()) {
            return;
        }

        const obj = {
            position: initialData
                ? initialData.position
                : itinerary.itinerary[selectedDate].length + 1,
            date: selectedDate,
            type: TRANSPORTATION,
            details: {
                title: name,
                customFields: {
                    type,
                    departureLocation,
                    departureTime: departureTime?.toISOString(),
                    arrivalLocation,
                    arrivalTime: arrivalTime?.toISOString(),
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
            navigation.goBack();
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: isUpdating ? 'Transportation Updated' : 'Transportation Added',
                    text2: isUpdating
                        ? 'Your transportation has been updated successfully'
                        : 'Your new transportation has been added successfully',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            }, 100);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: isUpdating
                    ? 'Failed to update transportation'
                    : 'Failed to add transportation',
                position: 'bottom',
                visibilityTime: 3000,
            });
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
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
                    <Text style={styles.title}>
                        {isViewOnly ? 'View Details' : isUpdating ? 'Update Transportation' : 'Add Transportation'}
                    </Text>
                    <Text style={styles.description}>Add a description here</Text>

                    <Text style={styles.label}>Type of transportation *</Text>
                    <View style={[styles.toggleContainer, isViewOnly && styles.disabledToggle]}>
                        {['Flight', 'Train', 'Car', 'Bus'].map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.toggleButton,
                                    type === option && { backgroundColor: theme.colors.primary },
                                    errors.type && styles.inputError
                                ]}
                                onPress={() => {
                                    setType(option);
                                    if (errors.type) {
                                        setErrors({ ...errors, type: '' });
                                    }
                                }}
                                disabled={isViewOnly}>
                                <Text
                                    style={[
                                        styles.toggleText,
                                        type === option && { color: theme.colors.onPrimary },
                                    ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            isViewOnly && styles.disabledInput,
                            errors.name && styles.inputError
                        ]}
                        placeholder="Enter name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) {
                                setErrors({ ...errors, name: '' });
                            }
                        }}
                        editable={!isViewOnly}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <Text style={styles.label}>Departure Location *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            isViewOnly && styles.disabledInput,
                            errors.departureLocation && styles.inputError
                        ]}
                        placeholder="Enter departure location"
                        value={departureLocation}
                        onChangeText={(text) => {
                            setDepartureLocation(text);
                            if (errors.departureLocation) {
                                setErrors({ ...errors, departureLocation: '' });
                            }
                        }}
                        editable={!isViewOnly}
                    />
                    {errors.departureLocation && <Text style={styles.errorText}>{errors.departureLocation}</Text>}

                    <Text style={styles.label}>Arrival Location *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            isViewOnly && styles.disabledInput,
                            errors.arrivalLocation && styles.inputError
                        ]}
                        placeholder="Enter arrival location"
                        value={arrivalLocation}
                        onChangeText={(text) => {
                            setArrivalLocation(text);
                            if (errors.arrivalLocation) {
                                setErrors({ ...errors, arrivalLocation: '' });
                            }
                        }}
                        editable={!isViewOnly}
                    />
                    {errors.arrivalLocation && <Text style={styles.errorText}>{errors.arrivalLocation}</Text>}

                    <View style={styles.timeRow}>
                        <View style={styles.timeColumn}>
                            <Text style={styles.label}>Departure Time</Text>
                            <TouchableOpacity
                                style={[
                                    styles.timeInput,
                                    !departureTime && styles.timeInputEmpty,
                                    isViewOnly && styles.disabledInput,
                                    timeError && styles.inputError
                                ]}
                                onPress={() => !isViewOnly && setShowDepartureTimePicker(true)}
                                disabled={isViewOnly}>
                                <Text style={[styles.timeText, !departureTime && styles.timeTextPlaceholder]}>
                                    {formatTime(departureTime) || 'Select time'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.timeColumn}>
                            <Text style={styles.label}>Arrival Time</Text>
                            <TouchableOpacity
                                style={[
                                    styles.timeInput,
                                    !arrivalTime && styles.timeInputEmpty,
                                    isViewOnly && styles.disabledInput,
                                    timeError && styles.inputError
                                ]}
                                onPress={() => !isViewOnly && setShowArrivalTimePicker(true)}
                                disabled={isViewOnly}>
                                <Text style={[styles.timeText, !arrivalTime && styles.timeTextPlaceholder]}>
                                    {formatTime(arrivalTime) || 'Select time'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {timeError && <Text style={styles.errorText}>{timeError}</Text>}

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
                        style={[styles.input, isViewOnly && styles.disabledInput]}
                        placeholder="Add booking or information link"
                        value={link}
                        onChangeText={setLink}
                        editable={!isViewOnly}
                    />

                    <Text style={styles.label}>Reservation Number</Text>
                    <TextInput
                        style={[styles.input, isViewOnly && styles.disabledInput]}
                        placeholder="Enter reservation number"
                        value={reservationNumber}
                        onChangeText={setReservationNumber}
                        editable={!isViewOnly}
                    />

                    <Text style={styles.label}>Note</Text>
                    <TextInput
                        style={[styles.input, styles.noteInput, isViewOnly && styles.disabledInput]}
                        placeholder="Add any extra details"
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                        editable={!isViewOnly}
                    />

                    {!isViewOnly && (
                        <View style={styles.buttonContainer}>
                            {!isUpdating && (
                                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                                    <Text style={styles.clearText}>Clear</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.addButton, isUpdating && { flex: 1 }]}
                                onPress={handleSave}>
                                <Text style={styles.addText}>{isUpdating ? 'Update' : 'Add to trip'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    description: {
        color: '#666',
        marginBottom: 24,
        fontSize: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: 'white',
        fontSize: 16,
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
        backgroundColor: '#004D40',
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
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
    },
    disabledToggle: {
        opacity: 0.7,
    },
    inputError: {
        borderColor: '#B00020',
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
        marginLeft: 4,
    },
});

export default TransportationForm; 