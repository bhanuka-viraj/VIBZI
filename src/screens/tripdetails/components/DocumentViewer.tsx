import React from 'react';
import {Platform, Alert} from 'react-native';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
}

const DocumentViewer = async ({fileUrl, fileName}: DocumentViewerProps) => {
  try {
    if (Platform.OS === 'android') {
      // For Android, use FileViewer
      await FileViewer.open(fileUrl, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });
    } else {
      // For iOS, use Share
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      await Share.open({
        url: base64 as string,
        filename: fileName,
      });
    }
  } catch (error) {
    console.error('Error opening document:', error);
    Alert.alert(
      'Error',
      'Could not open the document. Please make sure you have an app installed that can handle this file type.',
    );
  }
};

export default DocumentViewer;
