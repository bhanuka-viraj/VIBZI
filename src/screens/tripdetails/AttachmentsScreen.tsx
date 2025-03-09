import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  ScrollView,
} from 'react-native';
import {Text, ActivityIndicator, FAB} from 'react-native-paper';
import {
  useUploadAttachmentMutation,
  useGetAttachmentsByTripIdQuery,
  useDeleteAttachmentMutation,
} from '../../redux/slices/tripplan/attachmentSlice';
import {theme} from '../../constants/theme';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import * as DocumentPicker from 'react-native-document-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {formatFileSize, getFileIcon} from '../../utils/fileUtils';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {Permission} from 'react-native';
import AttachmentList from '../../components/AttachmentList';
import PendingAttachmentList from '../../components/PendingAttachmentList';
import {
  SUPPORTED_DOCUMENT_TYPES,
  SUPPORTED_IMAGE_TYPES,
  filterAttachmentsByType,
  filterPendingFilesByType,
} from '../../utils/tripUtils/attachmentUtils';

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

  const {data: attachmentData, isLoading} =
    useGetAttachmentsByTripIdQuery(tripId);
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // API 33+ (Android 13+)
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);
        return Object.values(granted).every(
          res => res === PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        // API 32 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const handleFilePick = async (type: 'image' | 'document') => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) return;

      const result = await DocumentPicker.pick({
        type:
          type === 'image' ? SUPPORTED_IMAGE_TYPES : SUPPORTED_DOCUMENT_TYPES,
        allowMultiSelection: true,
      });

      setPendingFiles(prev => [...prev, ...result]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleUploadAll = async () => {
    if (pendingFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of pendingFiles) {
        const formData = new FormData();
        formData.append('files', {
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          name: file.name || 'unnamed_file',
        } as any);
        formData.append('tripId', tripId as string);
        formData.append('title', file.name || 'Untitled');

        await uploadAttachment(formData).unwrap();
      }
      setPendingFiles([]);
      Alert.alert('Success', 'All files uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload some files');
    } finally {
      setUploading(false);
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (fileKey: string) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAttachment({tripId, fileKey}).unwrap();
              Alert.alert('Success', 'File deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete attachment');
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
                style={styles.addButton}
                onPress={() => handleFilePick('document')}
                disabled={uploading}>
                <MaterialIcons
                  name="description"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.addButtonText}>Add Document</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleFilePick('image')}
                disabled={uploading}>
                <MaterialIcons
                  name="image"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.addButtonText}>Add Image</Text>
              </TouchableOpacity>
            </View>

            {pendingFiles.length > 0 && (
              <View style={styles.pendingListsContainer}>
                {filterPendingFilesByType(pendingFiles, 'document').length >
                  0 && (
                  <View style={styles.pendingSection}>
                    <Text variant="titleSmall" style={styles.subsectionTitle}>
                      Pending Documents
                    </Text>
                    <PendingAttachmentList
                      files={filterPendingFilesByType(pendingFiles, 'document')}
                      onRemove={removePendingFile}
                    />
                  </View>
                )}

                {filterPendingFilesByType(pendingFiles, 'image').length > 0 && (
                  <View style={styles.pendingSection}>
                    <Text variant="titleSmall" style={styles.subsectionTitle}>
                      Pending Images
                    </Text>
                    <PendingAttachmentList
                      files={filterPendingFilesByType(pendingFiles, 'image')}
                      onRemove={removePendingFile}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.uploadAllButton}
                  onPress={handleUploadAll}
                  disabled={uploading}>
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
    flex: 1,
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
