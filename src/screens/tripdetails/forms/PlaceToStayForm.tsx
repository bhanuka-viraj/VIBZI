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
import { PLACESTOSTAY } from '@/constants/ItineraryTypes';
import Toast from 'react-native-toast-message';
import { ItineraryStackParamList } from '../../../navigation/ItineraryStackNavigator';
import DatePicker from 'react-native-date-picker';
import { validateTimeRange, validateRequiredFields } from '../../../utils/validation/formValidation';
import { SafeAreaView } from 'react-native-safe-area-context';

type PlaceToStayScreenRouteProp = RouteProp<ItineraryStackParamList, 'PlaceToStay'>;

const PlaceToStayForm = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute<PlaceToStayScreenRouteProp>();
    const { isViewOnly = false, isUpdating = false, initialData } = route.params;
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [isBooked, setIsBooked] = useState<boolean | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
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
        setIsBooked(false);
        setStartTime(now);
        setEndTime(now);
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
            setIsBooked(initialData.details.customFields?.isBooked === true ||
                initialData.details.customFields?.isBooked === "true");

            if (initialData.details.customFields?.startTime) {
                const startTimeDate = new Date(initialData.details.customFields.startTime);
                setStartTime(isNaN(startTimeDate.getTime()) ? null : startTimeDate);
            } else {
                setStartTime(null);
            }
            if (initialData.details.customFields?.endTime) {
                const endTimeDate = new Date(initialData.details.customFields.endTime);
                setEndTime(isNaN(endTimeDate.getTime()) ? null : endTimeDate);
            } else {
                setEndTime(null);
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
            { name },
            ['name']
        );
        const timeValidation = validateTimeRange(startTime, endTime);

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
            type: PLACESTOSTAY,
            details: {
                title: name,
                customFields: {
                    isBooked,
                    startTime: startTime?.toISOString(),
                    endTime: endTime?.toISOString(),
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
                    text1: isUpdating ? 'Place to Stay Updated' : 'Place to Stay Added',
                    text2: isUpdating
                        ? 'Your place to stay has been updated successfully'
                        : 'Your new place to stay has been added successfully',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            }, 100);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: isUpdating
                    ? 'Failed to update place to stay'
                    : 'Failed to add place to stay',
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
                        {isViewOnly ? 'View Details' : isUpdating ? 'Update Place to Stay' : 'Add Place to Stay'}
                    </Text>
                    <Text style={styles.description}>Add a description here</Text>

                    <Text style={styles.label}>Name Of Place *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            isViewOnly && styles.disabledInput,
                            errors.name && styles.inputError
                        ]}
                        placeholder="Enter place name"
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

                    <Text style={styles.label}>Booked?</Text>
                    <View style={[styles.toggleContainer, isViewOnly && styles.disabledToggle]}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                isBooked === true && { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={() => {
                                if (!isViewOnly) {
                                    setIsBooked(true);
                                }
                            }}
                            disabled={isViewOnly}>
                            <Text
                                style={[
                                    styles.toggleText,
                                    isBooked === true && { color: theme.colors.onPrimary },
                                ]}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                isBooked === false && { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={() => {
                                if (!isViewOnly) {
                                    setIsBooked(false);
                                }
                            }}
                            disabled={isViewOnly}>
                            <Text
                                style={[
                                    styles.toggleText,
                                    isBooked === false && { color: theme.colors.onPrimary },
                                ]}>
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timeRow}>
                        <View style={styles.timeColumn}>
                            <Text style={styles.label}>Start Time</Text>
                            <TouchableOpacity
                                style={[
                                    styles.timeInput,
                                    !startTime && styles.timeInputEmpty,
                                    isViewOnly && styles.disabledInput,
                                    timeError && styles.inputError
                                ]}
                                onPress={() => !isViewOnly && setShowStartPicker(true)}
                                disabled={isViewOnly}>
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
                                style={[
                                    styles.timeInput,
                                    !endTime && styles.timeInputEmpty,
                                    isViewOnly && styles.disabledInput,
                                    timeError && styles.inputError
                                ]}
                                onPress={() => !isViewOnly && setShowEndPicker(true)}
                                disabled={isViewOnly}>
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
                    {timeError && <Text style={styles.errorText}>{timeError}</Text>}

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

export default PlaceToStayForm; 