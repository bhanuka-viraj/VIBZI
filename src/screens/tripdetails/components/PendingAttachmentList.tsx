import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../../constants/theme';
import {getFileIcon} from '../../../utils/fileUtils';
import type {DocumentPickerResponse} from 'react-native-document-picker';
import {isImageFile} from '../../../utils/tripUtils/attachmentUtils';
import DocumentViewer from './DocumentViewer';

interface PendingAttachmentListProps {
  files: DocumentPickerResponse[];
  onRemove: (index: number) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;

const PendingAttachmentList = ({
  files,
  onRemove,
}: PendingAttachmentListProps) => {
  const handlePress = async (file: DocumentPickerResponse) => {
    if (!isImageFile(file.name || '')) {
      await DocumentViewer({
        fileUrl: file.uri,
        fileName: file.name || 'Unknown file',
      });
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {files.map((file, index) => {
        const isImage = isImageFile(file.name || '');
        return (
          <TouchableOpacity
            key={index}
            style={[styles.fileItem, isImage && styles.imageItem]}
            onPress={() => handlePress(file)}>
            {isImage ? (
              <Image
                source={{uri: file.uri}}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fileInfo}>
                <MaterialIcons
                  name={getFileIcon(file.name || '')}
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={e => {
                e.stopPropagation();
                onRemove(index);
              }}>
              <MaterialIcons
                name="close"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
  },
  fileItem: {
    width: 150,
    height: 100,
    marginRight: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  imageItem: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 0.75,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
});

export default PendingAttachmentList;
