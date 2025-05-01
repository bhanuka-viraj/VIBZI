import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import React from 'react';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ItineraryStackParamList } from '../../../navigation/ItineraryStackNavigator';
import { THINGSTODO, TRANSPORTATION, PLACESTOSTAY, FOODANDDRINK, NOTE } from '../../../constants/ItineraryTypes';

type ItineraryDetailsRouteProp = RouteProp<ItineraryStackParamList, 'ItineraryDetails'>;

const ItineraryDetails = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute<ItineraryDetailsRouteProp>();
    const { item } = route.params;

    const formatTime = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getIconByType = () => {
        switch (item.type) {
            case FOODANDDRINK:
                return <MaterialCommunityIcons name="food" size={24} color={theme.colors.primary} />;
            case THINGSTODO:
                return <MaterialCommunityIcons name="format-list-checks" size={24} color={theme.colors.primary} />;
            case PLACESTOSTAY:
                return <MaterialCommunityIcons name="bed" size={24} color={theme.colors.primary} />;
            case TRANSPORTATION:
                if (item.details.customFields.type === 'Flight') {
                    return <MaterialCommunityIcons name="airplane" size={24} color={theme.colors.primary} />;
                } else if (item.details.customFields.type === 'Train') {
                    return <MaterialCommunityIcons name="train" size={24} color={theme.colors.primary} />;
                } else if (item.details.customFields.type === 'Car') {
                    return <MaterialCommunityIcons name="car" size={24} color={theme.colors.primary} />;
                } else {
                    return <MaterialCommunityIcons name="bus" size={24} color={theme.colors.primary} />;
                }
            case NOTE:
                return <MaterialCommunityIcons name="note-text" size={24} color={theme.colors.primary} />;
            default:
                return null;
        }
    };

    const handleLinkPress = async (url: string) => {
        try {
            let formattedUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                formattedUrl = 'https://' + url;
            }
            await Linking.openURL(formattedUrl);
        } catch (error) {
            Alert.alert('Error', 'Unable to open this URL');
        }
    };

    const renderTransportationDetails = () => (
        <>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
                    <Text style={styles.label}>From</Text>
                </View>
                <Text style={styles.value}>{item.details.customFields.departureLocation}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
                    <Text style={styles.label}>To</Text>
                </View>
                <Text style={styles.value}>{item.details.customFields.arrivalLocation}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                    <Text style={styles.label}>Departure</Text>
                </View>
                <Text style={styles.value}>{formatTime(item.details.customFields.departureTime)}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                    <Text style={styles.label}>Arrival</Text>
                </View>
                <Text style={styles.value}>{formatTime(item.details.customFields.arrivalTime)}</Text>
            </View>
        </>
    );

    const renderCommonDetails = () => (
        <>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                    <Text style={styles.label}>Start Time</Text>
                </View>
                <Text style={styles.value}>{formatTime(item.details.customFields.startTime)}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                    <Text style={styles.label}>End Time</Text>
                </View>
                <Text style={styles.value}>{formatTime(item.details.customFields.endTime)}</Text>
            </View>
            {(item.type === PLACESTOSTAY || item.type === FOODANDDRINK || item.type === THINGSTODO) && (
                <View style={styles.detailRow}>
                    <View style={styles.labelContainer}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#666" />
                        <Text style={styles.label}>Booking Status</Text>
                    </View>
                    <Text style={styles.value}>
                        {item.details.customFields.isBooked === true ||
                            item.details.customFields.isBooked === "true" ? 'Booked' : 'Not Booked'}
                    </Text>
                </View>
            )}
            {item.details.customFields.activityName && (
                <View style={styles.detailRow}>
                    <View style={styles.labelContainer}>
                        <MaterialCommunityIcons name="information" size={20} color="#666" />
                        <Text style={styles.label}>Activity</Text>
                    </View>
                    <Text style={styles.value}>{item.details.customFields.activityName}</Text>
                </View>
            )}
        </>
    );

    const renderNoteDetails = () => (
        <>
            <View style={styles.noteContainer}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="note-text" size={20} color="#666" />
                    <Text style={styles.label}>Content</Text>
                </View>
                <View style={styles.noteBox}>
                    <Text style={styles.noteText}>{item.details.customFields.content}</Text>
                </View>
            </View>
        </>
    );

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
                        {getIconByType()}
                        <Text style={styles.headerText}>
                            {item.type === TRANSPORTATION ? 'Transportation' :
                                item.type === PLACESTOSTAY ? 'Place to Stay' :
                                    item.type === FOODANDDRINK ? 'Food & Drink' :
                                        item.type === NOTE ? 'Note' : 'Things to Do'}
                        </Text>
                    </View>

                    <Text style={styles.title}>{item.details.title}</Text>

                    <View style={styles.detailsContainer}>
                        {item.type === TRANSPORTATION ? renderTransportationDetails() :
                            item.type === NOTE ? renderNoteDetails() :
                                renderCommonDetails()}

                        {item.type !== NOTE && (
                            <>
                                {item.details.customFields.link && (
                                    <View style={styles.detailRow}>
                                        <View style={styles.labelContainer}>
                                            <MaterialCommunityIcons name="link" size={20} color="#666" />
                                            <Text style={styles.label}>Link</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => handleLinkPress(item.details.customFields.link)}>
                                            <Text style={[styles.value, styles.link]} numberOfLines={1}>
                                                {item.details.customFields.link.replace(/^https?:\/\//, '')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {item.details.customFields.reservationNumber && (
                                    <View style={styles.detailRow}>
                                        <View style={styles.labelContainer}>
                                            <MaterialCommunityIcons name="ticket-confirmation" size={20} color="#666" />
                                            <Text style={styles.label}>Reservation Number</Text>
                                        </View>
                                        <Text style={styles.value}>{item.details.customFields.reservationNumber}</Text>
                                    </View>
                                )}

                                {item.details.customFields.note && (
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
                            </>
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

export default ItineraryDetails; 