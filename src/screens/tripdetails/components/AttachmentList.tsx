import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../../constants/theme';
import {getFileIcon} from '../../../utils/fileUtils';

interface AttachmentListProps {
  title: string;
  attachments: Array<{
    key: string;
    originalFilename: string;
    fileUrl: string;
  }>;
  onDelete: (key: string) => void;
}

const AttachmentList = ({
  title,
  attachments,
  onDelete,
}: AttachmentListProps) => {
  const handlePress = (fileUrl: string) => {
    Linking.openURL(fileUrl);
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
            style={styles.attachmentItem}
            onPress={() => handlePress(item.fileUrl)}>
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
    alignSelf: 'flex-end',
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
