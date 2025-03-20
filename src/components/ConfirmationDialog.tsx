import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { theme } from '../constants/theme';

interface ConfirmationDialogProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonStyle?: 'primary' | 'danger';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    visible,
    onDismiss,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonStyle = 'primary'
}) => {
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss}
                style={styles.dialog}>
                <View style={styles.contentContainer}>
                    <Text style={styles.dialogTitle}>{title}</Text>
                    <Text style={styles.dialogContentText}>{message}</Text>

                    <View style={styles.dialogActions}>
                        <TouchableOpacity
                            onPress={onDismiss}
                            style={[styles.dialogButton, styles.cancelButton]}>
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[
                                styles.dialogButton,
                                confirmButtonStyle === 'primary' ? styles.primaryDialogButton : styles.dangerDialogButton
                            ]}>
                            <Text style={styles.confirmDialogButtonText}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
        </Portal>
    );
};

const { width } = Dimensions.get('window');
const dialogWidth = width * 0.85;

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'white',
        borderRadius: 14,
        elevation: 24,
        width: dialogWidth,
        alignSelf: 'center',
    },
    contentContainer: {
        padding: 24,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    dialogContentText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    dialogActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    dialogButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    primaryDialogButton: {
        backgroundColor: theme.colors.primary,
    },
    dangerDialogButton: {
        backgroundColor: '#FF4444',
    },
    confirmDialogButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
});

export default ConfirmationDialog; 