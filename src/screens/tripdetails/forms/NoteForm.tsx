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
import { NOTE } from '@/constants/ItineraryTypes';
import Toast from 'react-native-toast-message';
import { ItineraryStackParamList } from '../../../navigation/ItineraryStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

type NoteScreenRouteProp = RouteProp<ItineraryStackParamList, 'Note'>;

const NoteForm = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute<NoteScreenRouteProp>();
    const { isViewOnly = false, isUpdating = false, initialData } = route.params;
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedDate = useSelector((state: any) => state.meta.trip.select_date);
    const tripData = useSelector((state: any) => state.meta.trip);
    const itinerary = tripData?.itinerary || null;
    const it_id = itinerary?.id || '';

    const [updateItinerary, { isLoading }] = useUpdateTripPlanItineraryMutation();

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.details.title || '');
            setContent(initialData.details.customFields?.content || '');
        }
    }, [initialData]);

    const validateForm = (): boolean => {
        setErrors({});
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            type: NOTE,
            details: {
                title,
                customFields: {
                    content,
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
            navigation.goBack();
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: isUpdating ? 'Note Updated' : 'Note Added',
                    text2: isUpdating
                        ? 'Your note has been updated successfully'
                        : 'Your new note has been added successfully',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            }, 100);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: isUpdating
                    ? 'Failed to update note'
                    : 'Failed to add note',
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
                        {isViewOnly ? 'View Note' : isUpdating ? 'Update Note' : 'Add Note'}
                    </Text>
                    <Text style={styles.description}>Add a description here</Text>

                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            isViewOnly && styles.disabledInput,
                            errors.title && styles.inputError
                        ]}
                        placeholder="Enter title"
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                            if (errors.title) {
                                setErrors({ ...errors, title: '' });
                            }
                        }}
                        editable={!isViewOnly}
                    />
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                    <Text style={styles.label}>Content *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.noteInput,
                            isViewOnly && styles.disabledInput,
                            errors.content && styles.inputError
                        ]}
                        placeholder="Enter your note"
                        value={content}
                        onChangeText={(text) => {
                            setContent(text);
                            if (errors.content) {
                                setErrors({ ...errors, content: '' });
                            }
                        }}
                        multiline
                        numberOfLines={6}
                        editable={!isViewOnly}
                    />
                    {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}

                    {!isViewOnly && (
                        <View style={styles.buttonContainer}>
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
    noteInput: {
        height: 150,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
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
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
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

export default NoteForm; 