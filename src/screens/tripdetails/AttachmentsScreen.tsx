import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Text, ActivityIndicator, FAB } from 'react-native-paper';
import {
  useUploadAttachmentMutation,
  useGetAttachmentsByTripIdQuery,
  useDeleteAttachmentMutation,
} from '../../redux/slices/tripplan/attachmentSlice';
import { theme } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import * as DocumentPicker from 'react-native-document-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Permission } from 'react-native';
import AttachmentList from '../../components/AttachmentList';
import PendingAttachmentList from '../../components/PendingAttachmentList';
import {
  SUPPORTED_DOCUMENT_TYPES,
  SUPPORTED_IMAGE_TYPES,
  filterAttachmentsByType,
} from '../../utils/tripUtils/attachmentUtils';
import EmptyState from '../../components/EmptyState';
import Toast from 'react-native-toast-message';

type PermissionStatus = {
  [key in Permission]?: boolean;
};

const AttachmentsScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<
    DocumentPicker.DocumentPickerResponse[]
  >([]);
  const trip = useSelector((state: RootState) => state.meta.trip);
  const tripId = trip?.id;

  const { data: attachmentData, isLoading } =
    useGetAttachmentsByTripIdQuery(tripId);
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const requestStoragePermission = async () => {
    // if (Platform.OS === 'android') {
    //   if (Platform.Version >= 33) {
    //     // API 33+ (Android 13+)
    //     const granted = await PermissionsAndroid.requestMultiple([
    //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
    //     ]);
    //     return Object.values(granted).every(
    //       (res) => res === PermissionsAndroid.RESULTS.GRANTED,
    //     );
    //   } else {
    //     // API 32 and below
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //     );
    //     return granted === PermissionsAndroid.RESULTS.GRANTED;
    //   }
    // }
    return true;
  };

  const handleFilePick = async (type: 'image' | 'document' | 'all') => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Error', 'Storage permission denied');
        return;
      }

      const fileTypes =
        type === 'image'
          ? SUPPORTED_IMAGE_TYPES
          : type === 'document'
            ? SUPPORTED_DOCUMENT_TYPES
            : [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOCUMENT_TYPES];

      const result = await DocumentPicker.pick({
        type: fileTypes,
        allowMultiSelection: true,
      });

      // Filter out duplicates based on URI
      const newFiles = result.filter((newFile) => !pendingFiles.some((f) => f.uri === newFile.uri));
      setPendingFiles((prev) => [...prev, ...newFiles]);

      if (newFiles.length > 0) {
        Toast.show({
          type: 'success',
          text1: 'Files Selected',
          text2: `${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added to upload queue`,
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File pick error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to select files',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleUploadAll = async () => {
    if (pendingFiles.length === 0) return;

    setUploading(true);
    const failedFiles: string[] = [];
    try {
      for (const file of pendingFiles) {
        try {
          const formData = new FormData();
          formData.append('files', {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.name || 'unnamed_file',
          } as any);
          formData.append('tripId', tripId as string);
          formData.append('title', file.name || 'Untitled');

          await uploadAttachment(formData).unwrap();
        } catch (error) {
          failedFiles.push(file.name || 'Unnamed file');
        }
      }
      setPendingFiles([]);
      if (failedFiles.length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Upload Error',
          text2: `Failed to upload: ${failedFiles.join(', ')}`,
          position: 'bottom',
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Upload Complete',
          text2: 'All files uploaded successfully',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Failed to upload some files',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const removePendingFile = (index: number) => {
    const removedFile = pendingFiles[index];
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    Toast.show({
      type: 'delete',
      text1: 'File Removed',
      text2: `${removedFile.name || 'Unnamed file'} removed from upload queue`,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleDelete = async (fileKey: string) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAttachment({ tripId, fileKey }).unwrap();
              Toast.show({
                type: 'delete',
                text1: 'Attachment Deleted',
                text2: 'File has been removed from your trip',
                position: 'bottom',
                visibilityTime: 3000,
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete attachment',
                position: 'bottom',
                visibilityTime: 3000,
              });
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.pendingSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Add Files
            </Text>
            <View style={styles.addButtonsContainer}>
              <TouchableOpacity
                style={[styles.addButton, { flex: 1 }]}
                onPress={() => handleFilePick('all')}
                disabled={uploading}
              >
                <MaterialIcons
                  name="attach-file"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.addButtonText}>Add Files</Text>
              </TouchableOpacity>
            </View>

            {pendingFiles.length > 0 && (
              <View style={styles.pendingListsContainer}>
                <Text variant="titleSmall" style={styles.subsectionTitle}>
                  Pending Files
                </Text>
                <PendingAttachmentList
                  files={pendingFiles}
                  onRemove={removePendingFile}
                />
                <TouchableOpacity
                  style={styles.uploadAllButton}
                  onPress={handleUploadAll}
                  disabled={uploading}
                >
                  <Text style={styles.uploadAllText}>
                    {uploading ? 'Uploading...' : 'Upload All'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {filterAttachmentsByType(attachmentData?.attachments || [], 'image')
            .length > 0 && (
              <AttachmentList
                title="Images"
                attachments={filterAttachmentsByType(
                  attachmentData?.attachments || [],
                  'image',
                )}
                onDelete={handleDelete}
              />
            )}

          {filterAttachmentsByType(
            attachmentData?.attachments || [],
            'document',
          ).length > 0 && (
              <AttachmentList
                title="Documents"
                attachments={filterAttachmentsByType(
                  attachmentData?.attachments || [],
                  'document',
                )}
                onDelete={handleDelete}
              />
            )}

          {(!attachmentData?.attachments ||
            attachmentData.attachments.length === 0) &&
            pendingFiles.length === 0 && (
              <EmptyState
                icon="file-document-outline"
                title="No Attachments"
                subtitle="Your trip has no attachments yet"
                description="Add documents or images using the button above"
              />
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  addButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    marginTop: 4,
    color: theme.colors.primary,
    fontSize: 12,
  },
  pendingListsContainer: {
    gap: 16,
  },
  subsectionTitle: {
    marginBottom: 8,
    color: theme.colors.secondary,
  },
  uploadAllButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  uploadAllText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default AttachmentsScreen;