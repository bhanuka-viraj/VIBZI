import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { theme } from "../../../constants/theme";
import { useDispatch } from "react-redux";
import { addChecklistItem } from "../../../redux/slices/checklistSlice";
import { v4 as uuidv4 } from "uuid";

interface ChecklistActionSheetProps {
    actionSheetRef: React.RefObject<ActionSheetRef>;
}

const ChecklistActionSheet: React.FC<ChecklistActionSheetProps> = ({
    actionSheetRef,
}) => {
    const dispatch = useDispatch();
    const [item, setItem] = useState("");

    const handleClear = () => {
        setItem("");
    };

    const handleAdd = () => {
        if (!item.trim()) return;

        dispatch(
            addChecklistItem({
                id: uuidv4(),
                text: item.trim(),
                isCompleted: false,
            })
        );

        actionSheetRef.current?.hide();
        handleClear();
    };

    return (
        <ActionSheet ref={actionSheetRef} gestureEnabled>
            <ScrollView contentContainerStyle={styles.modalContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Add Checklist Item</Text>
                <Text style={styles.description}>Add items to your checklist</Text>

                <Text style={styles.label}>Checklist Item *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter item (e.g., Pack sunscreen)"
                    value={item}
                    onChangeText={setItem}
                    returnKeyType="done"
                    onSubmitEditing={handleAdd}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClear}
                    >
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addButton, !item.trim() && styles.addButtonDisabled]}
                        onPress={handleAdd}
                        disabled={!item.trim()}
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
        fontSize: 16,
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
    addButtonDisabled: {
        backgroundColor: theme.colors.primary + '80', // Adding 80 for 50% opacity
    },
    addText: {
        color: "white",
        fontWeight: "500",
    },
});

export default ChecklistActionSheet; 