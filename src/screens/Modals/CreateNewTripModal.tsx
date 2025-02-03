import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Icon } from "react-native-paper";
import { theme } from "../../constants/theme";

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateTripModal: React.FC<CreateTripModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Icon source="close" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Create a trip</Text>

          <Text style={styles.label}>Trip name</Text>
          <TextInput style={styles.input} placeholder="e.g., Summer vacation in Greece" maxLength={80} />

          <Text style={styles.label}>Destination</Text>
          <View style={styles.searchContainer}>
            <Icon source="magnify" size={20} color="gray" />
            <TextInput style={styles.searchInput} placeholder="Where to?" />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createText}>Create trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateTripModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  closeIcon: {
    alignSelf: "flex-end",
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
