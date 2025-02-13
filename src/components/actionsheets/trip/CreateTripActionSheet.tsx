import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-paper";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import DatePicker from "react-native-date-picker"; // Import date picker
import { theme } from "../../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

interface CreateTripActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
}

const CreateTripActionSheet: React.FC<CreateTripActionSheetProps> = ({
  actionSheetRef,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  return (
    <ActionSheet ref={actionSheetRef} gestureEnabled>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Create a Trip</Text>

        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Summer vacation in Greece"
          maxLength={80}
          value={tripName}
          onChangeText={setTripName}
        />

        <Text style={styles.label}>Destination</Text>
        <View style={styles.searchContainer}>
          <Icon source="magnify" size={20} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <Text style={styles.label}>Select Date Range</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowFromDate(true)}
        >
          <Text
            style={[
              styles.datePickerButtonText,
              { color: fromDate || toDate ? "black" : "gray" },
            ]}
          >
            From: {fromDate ? fromDate.toDateString() : "Select Start Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowToDate(true)}
        >
          <Text
            style={[
              styles.datePickerButtonText,
              { color: fromDate || toDate ? "black" : "gray" },
            ]}
          >
            To: {toDate ? toDate.toDateString() : "Select End Date"}
          </Text>
        </TouchableOpacity>


        <DatePicker
          modal
          open={showFromDate}
          date={fromDate || new Date()}
          mode="date"
          onConfirm={(date) => {
            setFromDate(date);
            setShowFromDate(false);
          }}
          onCancel={() => setShowFromDate(false)}
        />
        <DatePicker
          modal
          open={showToDate}
          date={toDate || new Date()}
          mode="date"
          onConfirm={(date) => {
            setToDate(date);
            setShowToDate(false);
          }}
          onCancel={() => setShowToDate(false)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.hide()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              actionSheetRef.current?.hide();
              navigation.navigate("TripDetails", {
                tripName,
                destination,
                fromDate,
                toDate,
              });
            }}
          >
            <Text style={styles.createText}>Create Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
};

export default CreateTripActionSheet;

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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  cancelText: {
    fontSize: 16,
    color: "gray",
  },
  createButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    alignItems: "center",
    padding: 12,
  },
  createText: {
    fontSize: 16,
    color: "white",
  },
});