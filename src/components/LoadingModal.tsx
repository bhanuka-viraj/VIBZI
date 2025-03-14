import React from 'react';
import {View, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../constants/theme';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const LoadingModal = ({visible, message = 'Logging in'}: LoadingModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>{message}</Text>
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.spinner}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 200,
  },
  text: {
    marginRight: 16,
    fontSize: 16,
  },
  spinner: {
    marginLeft: 8,
  },
});

export default LoadingModal;
