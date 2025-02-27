import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
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

type PermissionStatus = {
  [key in Permission]?: boolean;
};

const AttachmentsScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const trip = useSelector((state: RootState) => state.meta.trip);
  const tripId = trip?.id;

  const {data: attachmentData, isLoading} =
    useGetAttachmentsByTripIdQuery(tripId);
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  // const requestStoragePermission = async () => {
  //   if (Platform.OS !== 'android') return true;
  //   try {
  //     console.log('Requesting permissions...');

  //     if (Platform.Version >= 33) {
  //       // For Android 13+, request media permissions first
  //       const mediaPermissions = [
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
  //       ];

  //       const mediaGranted = await PermissionsAndroid.requestMultiple(
  //         mediaPermissions,
  //       );
  //       console.log('Media permissions:', mediaGranted);

  //       const hasStorageAccess = await PermissionsAndroid.check(
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       );
  //       console.log('Has storage access:', hasStorageAccess);

  //       if (!hasStorageAccess) {
  //         // Request storage permission
  //         const storageGranted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //           {
  //             title: 'Files Permission',
  //             message:
  //               'This app needs access to your files to upload documents.',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //           },
  //         );
  //         console.log('Storage permission result:', storageGranted);

  //         if (storageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           Alert.alert(
  //             'Storage Permission Required',
  //             'Please enable storage permission in Settings to upload all types of files.',
  //             [
  //               {text: 'Cancel', style: 'cancel'},
  //               {
  //                 text: 'Open Settings',
  //                 onPress: () => Linking.openSettings(),
  //               },
  //             ],
  //           );
  //           return false;
  //         }
  //       }

  //       return true;
  //     } else {
  //       // for Android 12 and below
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission',
  //           message: 'This app needs access to your storage to upload files.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     }
  //   } catch (err) {
  //     console.warn('Permission error:', err);
  //     return false;
  //   }
  // };

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) { 
      // API 33+ (Android 13+)
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
      ]);
      return Object.values(granted).every(res => res === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      // API 32 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true; // iOS doesn't need explicit storage permissions
};


  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      const granted = await requestStoragePermission();
      setHasPermission(granted);
    };
    checkAndRequestPermissions();
  }, []);

  const handleFilePick = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant storage permissions to upload files.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Retry',
            onPress: async () => {
              const granted = await requestStoragePermission();
              setHasPermission(granted);
              if (granted) handleFilePick();
            },
          },
        ],
      );
      return;
    }

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const file = result[0];
      handleUpload(file);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File pick error:', err);
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleUpload = async (file: DocumentPicker.DocumentPickerResponse) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/octet-stream',
        name: file.name || 'unnamed_file',
      });
      formData.append('tripId', tripId as string);

      await uploadAttachment(formData).unwrap();
      Alert.alert('Success', 'File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
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
        <View style={styles.container}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleFilePick}
            disabled={uploading}>
            <MaterialIcons name="upload-file" size={24} color="white" />
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload File'}
            </Text>
          </TouchableOpacity>

          {!attachmentData?.attachments?.length ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No attachments yet</Text>
            </View>
          ) : (
            <FlatList
              data={attachmentData.attachments}
              renderItem={({item}) => (
                <View style={styles.attachmentItem}>
                  <View style={styles.fileInfo}>
                    <MaterialIcons
                      name={getFileIcon(item.originalFilename)}
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {item.originalFilename}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.key)}>
                    <MaterialIcons
                      name="delete"
                      size={24}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.key}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </View>
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
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    flexGrow: 1,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AttachmentsScreen;
