import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { theme } from "../../../constants/theme";
import { useDispatch } from "react-redux";
import { addFoodAndDrink } from "../../../redux/slices/tripplan/itinerary/sheets/foodAndDrinkSlice";


import { v4 as uuidv4 } from "uuid";

interface FoodAndDrinkActionSheetProps {
    actionSheetRef: React.RefObject<ActionSheetRef>;
}


const AddFoodAndDrinkActionSheet: React.FC<FoodAndDrinkActionSheetProps> = ({
    actionSheetRef,
}) => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [isBooked, setIsBooked] = useState<boolean | null>(null);
    const [link, setLink] = useState("");
    const [reservationNumber, setReservationNumber] = useState("");
    const [note, setNote] = useState("");

    const handleAdd = () => {
        if (!name.trim()) return;

        dispatch(
            addFoodAndDrink({
                id: uuidv4(),
                name,
                isBooked,
                link,
                reservationNumber,
                note,
            })
        );

        actionSheetRef.current?.hide();
        handleClear();
    };

    const handleClear = () => {
        setName("");
        setIsBooked(null);
        setLink("");
        setReservationNumber("");
        setNote("");
    };

    return (
        <ActionSheet ref={actionSheetRef} gestureEnabled>
            <ScrollView contentContainerStyle={styles.modalContainer} showsVerticalScrollIndicator={false}>
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
                            isBooked === true && { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={() => setIsBooked(true)}
                    >
                        <Text style={[
                            styles.toggleText,
                            isBooked === true && { color: theme.colors.onPrimary }
                        ]}>
                            Yes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            isBooked === false && { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={() => setIsBooked(false)}
                    >
                        <Text style={[
                            styles.toggleText,
                            isBooked === false && { color: theme.colors.onPrimary }
                        ]}>
                            No
                        </Text>
                    </TouchableOpacity>
                </View>

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
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClear}
                    >
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAdd}
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
        paddingBottom: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        color: "#666",
        marginBottom: 20,
        fontSize: 14,
    },
    label: {
        fontSize: 14,
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
        backgroundColor: "white",
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
    timeRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },
    timeColumn: {
        flex: 1,
    },
    timeInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
    },
    timeText: {
        fontSize: 16,
    },
    noteInput: {
        height: 100,
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

export default AddFoodAndDrinkActionSheet;