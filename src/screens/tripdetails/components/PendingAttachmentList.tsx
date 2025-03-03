import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../../constants/theme';
import {getFileIcon} from '../../../utils/fileUtils';
import type {DocumentPickerResponse} from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';

interface PendingAttachmentListProps {
  files: DocumentPickerResponse[];
  onRemove: (index: number) => void;
}

const PendingAttachmentList = ({
  files,
  onRemove,
}: PendingAttachmentListProps) => {
  const handlePress = async (file: DocumentPickerResponse) => {
    try {
      await FileViewer.open(file.uri, {
        showOpenWithDialog: true,
      });
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {files.map((file, index) => (
        <TouchableOpacity
          key={index}
          style={styles.fileItem}
          onPress={() => handlePress(file)}>
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={e => {
              e.stopPropagation(); // Prevent triggering parent's onPress
              onRemove(index);
            }}>
            <MaterialIcons name="close" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
  },
  fileItem: {
    width: 150,
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
  closeButton: {
    alignSelf: 'flex-end',
  },
});

export default PendingAttachmentList;
