import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';
import { Text, useTheme, Modal, Portal, IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

interface TripDescriptionModalProps {
    visible: boolean;
    onDismiss: () => void;
    description: string;
    onSave: (newDescription: string) => void;
    tripId?: string;
}

const TripDescriptionModal: React.FC<TripDescriptionModalProps> = ({
    visible,
    onDismiss,
    description,
    onSave,
    tripId,
}) => {
    const theme = useTheme();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedDescription, setEditedDescription] = React.useState(description);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (visible) {
            // Reset animation values
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.9);
            slideAnim.setValue(20);

            // Start animations
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleSave = () => {
        onSave(editedDescription);
        setIsEditing(false);
        Toast.show({
            type: 'success',
            text1: 'Description Updated',
            position: 'bottom',
            visibilityTime: 3000
        });
    };

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 20,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
            setIsEditing(false);
        });
    };

    const modalKey = `modal-${tripId || 'default'}-${visible ? 'visible' : 'hidden'}`;
    const contentKey = `content-${tripId || 'default'}-${isEditing ? 'edit' : 'view'}`;

    return (
        <Portal key={`portal-${modalKey}`}>
            {visible && (
                <Modal
                    key={modalKey}
                    visible={true}
                    onDismiss={handleDismiss}
                    contentContainerStyle={styles.modalContent}>
                    <Animated.View
                        key={contentKey}
                        style={[
                            styles.modalInner,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { scale: scaleAnim },
                                    { translateY: slideAnim },
                                ],
                            },
                        ]}>
                        <View key={`header-${contentKey}`} style={styles.modalHeader}>
                            <View key={`title-${contentKey}`} style={styles.titleContainer}>
                                <MaterialIcons
                                    key={`icon-${contentKey}`}
                                    name="description"
                                    size={24}
                                    color={theme.colors.primary}
                                    style={styles.descriptionIcon}
                                />
                                <Text key={`title-text-${contentKey}`} variant="titleLarge" style={styles.modalTitle}>
                                    Trip Description
                                </Text>
                            </View>
                            <View key={`actions-${contentKey}`} style={styles.modalActions}>
                                <IconButton
                                    key={`edit-button-${contentKey}`}
                                    icon={isEditing ? "check" : "pencil"}
                                    iconColor={theme.colors.primary}
                                    size={24}
                                    onPress={() => setIsEditing(!isEditing)}
                                />
                                <IconButton
                                    key={`close-button-${contentKey}`}
                                    icon="close"
                                    iconColor={theme.colors.error}
                                    size={24}
                                    onPress={handleDismiss}
                                />
                            </View>
                        </View>
                        <View key={`divider-${contentKey}`} style={styles.divider} />
                        <View key={`body-${contentKey}`} style={styles.modalBody}>
                            {isEditing ? (
                                <TextInput
                                    key={`input-${contentKey}`}
                                    style={styles.descriptionInput}
                                    value={editedDescription}
                                    onChangeText={setEditedDescription}
                                    multiline
                                    numberOfLines={8}
                                    placeholder="Enter trip description"
                                    textAlignVertical="top"
                                    placeholderTextColor="#999"
                                />
                            ) : (
                                <Text key={`description-${contentKey}`} style={styles.modalDescription}>
                                    {description}
                                </Text>
                            )}
                        </View>
                        {isEditing && (
                            <TouchableOpacity
                                key={`save-button-${contentKey}`}
                                style={styles.saveButton}
                                onPress={handleSave}>
                                <Text key={`save-text-${contentKey}`} style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </Modal>
            )}
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        marginHorizontal: 20,
    },
    modalInner: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingBottom: 20,
        maxHeight: '80%',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#333',
        marginLeft: 8,
    },
    modalActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: 20,
    },
    modalBody: {
        padding: 20,
    },
    descriptionIcon: {
        marginTop: 1,
    },
    modalDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        letterSpacing: 0.3,
    },
    descriptionInput: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        letterSpacing: 0.3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        minHeight: 200,
        backgroundColor: '#f8f8f8',
    },
    saveButton: {
        backgroundColor: '#004D40',
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TripDescriptionModal; 