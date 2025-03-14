import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { theme } from '../../constants/theme';

interface ItineraryOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const ItineraryOptionsModal: React.FC<ItineraryOptionsModalProps> = ({
  visible,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const paperTheme = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, { borderBottomWidth: 1 }]} 
            onPress={() => {
              onUpdate();
              onClose();
            }}
          >
            <Text style={styles.optionText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Text style={[styles.optionText, { color: paperTheme.colors.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
});

export default ItineraryOptionsModal;