import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { theme } from "../../../constants/theme";

interface AddTransportationActionSheetProps {
    actionSheetRef: React.RefObject<ActionSheetRef>;
}

const AddTransportationActionSheet: React.FC<AddTransportationActionSheetProps> = ({
    actionSheetRef,
}) => {
    const [type, setType] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [departureLocation, setDepartureLocation] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [arrivalLocation, setArrivalLocation] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [link, setLink] = useState("");
    const [reservationNumber, setReservationNumber] = useState("");
    const [note, setNote] = useState("");

    const handleClear = () => {
        setType(null);
        setName("");
        setDepartureLocation("");
        setDepartureTime("");
        setArrivalLocation("");
        setArrivalTime("");
        setLink("");
        setReservationNumber("");
        setNote("");
    };

    return (
        <ActionSheet ref={actionSheetRef} gestureEnabled>
            <ScrollView contentContainerStyle={styles.modalContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Add Transportation</Text>
                <Text style={styles.description}>Add a description here</Text>

                <Text style={styles.label}>Type of transportation</Text>
                <View style={styles.toggleContainer}>
                    {["Flight", "Train", "Car", "Bus"].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.toggleButton, type === option && { backgroundColor: theme.colors.primary }]}
                            onPress={() => setType(option)}
                        >
                            <Text style={[styles.toggleText, type === option && { color: theme.colors.onPrimary }]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter name"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Departure Location</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter departure location"
                    value={departureLocation}
                    onChangeText={setDepartureLocation}
                />

                <Text style={styles.label}>Departure Time</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter departure time"
                    value={departureTime}
                    onChangeText={setDepartureTime}
                />

                <Text style={styles.label}>Arrival Location</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter arrival location"
                    value={arrivalLocation}
                    onChangeText={setArrivalLocation}
                />

                <Text style={styles.label}>Arrival Time</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter arrival time"
                    value={arrivalTime}
                    onChangeText={setArrivalTime}
                />

                <Text style={styles.label}>Link</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Add link"
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
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClear}
                    >
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => actionSheetRef.current?.hide()}
                    >
                        <Text style={styles.addText}>Add to trip</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ActionSheet>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        color: "#666",
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    toggleContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 25,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    toggleText: {
        fontSize: 16,
        fontWeight: "500",
    },
    noteInput: {
        height: 80,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },
    clearButton: {
        flex: 1,
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 25,
    },
    clearText: {
        color: "#757575",
        fontWeight: "500",
    },
    addButton: {
        flex: 1,
        alignItems: "center",
        padding: 16,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
    },
    addText: {
        color: "white",
        fontWeight: "500",
    },
});

export default AddTransportationActionSheet;
