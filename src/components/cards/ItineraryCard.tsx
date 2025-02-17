import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


interface ItineraryItem {
    id: string;
    name: string;
    type: string;
    isBooked: boolean | null;
    link?: string;
    reservationNumber?: string;
    note?: string;
    fromTime?: string;
    toTime?: string;
    fromDate?: string;
    toDate?: string;
    checkInTime?: string;
}

const ItineraryCard: React.FC<{ item: ItineraryItem }> = ({ item }) => {
    return (
        <View style={styles.card}>
            <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
            <Text>
                {item.fromTime && item.toTime && <Text variant="bodyMedium"><MaterialIcons name="schedule" size={15} /> {item.fromTime} - {item.toTime}</Text>}
                {item.fromDate && item.toDate && <Text variant="bodyMedium"><MaterialIcons name="calendar-month" size={15} /> {}{item.fromDate} - {item.toDate}</Text>}
                {item.checkInTime && <Text variant="bodyMedium"> Check-in: {item.checkInTime}</Text>}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc"
    },
    name: {
        marginBottom: 5,
        color: '#000',
        fontSize: 18
    },
});

export default ItineraryCard;
