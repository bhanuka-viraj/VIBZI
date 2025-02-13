import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { theme } from "../../../constants/theme";

interface NoteActionSheetProps {
    actionSheetRef: React.RefObject<ActionSheetRef>;
}


const NoteActionSheet: React.FC<NoteActionSheetProps> = ({
    actionSheetRef,
}) => {
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");


    const handleClear = () => {
        setTitle("");
        setNote("");
    };

    return (
        <ActionSheet ref={actionSheetRef} gestureEnabled>
            <ScrollView contentContainerStyle={styles.modalContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Add Note</Text>

                <Text style={styles.label}>Title (optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter title"
                    value={title}
                    onChangeText={setTitle}
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

export default NoteActionSheet;