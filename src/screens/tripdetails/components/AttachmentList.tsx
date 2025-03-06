import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../../constants/theme';
import {getFileIcon} from '../../../utils/fileUtils';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import {isImageFile} from '../../../utils/tripUtils/attachmentUtils';
import DocumentViewer from './DocumentViewer';

interface AttachmentListProps {
  title: string;
  attachments: Array<{
    key: string;
    originalFilename: string;
    fileUrl: string;
  }>;
  onDelete: (key: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;

const AttachmentList = ({
  title,
  attachments,
  onDelete,
}: AttachmentListProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const imageUrls = attachments
    .filter(item => isImageFile(item.originalFilename))
    .map(item => ({uri: item.fileUrl}));

  const handlePress = async (fileUrl: string, fileName: string) => {
    if (isImageFile(fileName)) {
      const index = attachments.findIndex(
        item => item.fileUrl === fileUrl && isImageFile(item.originalFilename),
      );
      setSelectedImageIndex(index);
    } else {
      console.log('fileUrl', fileUrl);
      console.log('fileName', fileName);

      await DocumentViewer({fileUrl, fileName});
    }
  };

  if (!attachments.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No attachments yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {attachments.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.attachmentItem,
              isImageFile(item.originalFilename) && styles.imageItem,
            ]}
            onPress={() => handlePress(item.fileUrl, item.originalFilename)}>
            {isImageFile(item.originalFilename) ? (
              <FastImage
                style={styles.image}
                source={{uri: item.fileUrl}}
                resizeMode={FastImage.resizeMode.cover}
                onError={() => console.log('Failed to load image')}
              />
            ) : (
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
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(item.key)}>
              <MaterialIcons
                name="delete"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ImageView
        images={imageUrls}
        imageIndex={selectedImageIndex}
        visible={selectedImageIndex >= 0}
        onRequestClose={() => setSelectedImageIndex(-1)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
  },
  attachmentItem: {
    width: 200,
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
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AttachmentList;
