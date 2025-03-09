import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {WebView} from 'react-native-webview';
import {theme} from '../constants/theme';

interface DocumentViewerProps {
  visible: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const DocumentViewer = ({
  visible,
  onClose,
  fileUrl,
  fileName,
}: DocumentViewerProps) => {
  // Encode the URL properly to avoid any broken links
  const encodedUrl = encodeURI(fileUrl);

  // Function to determine the correct viewer URL
  const getViewerUrl = (url: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url,
    )}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {fileName}
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            iconColor={theme.colors.primary}
          />
        </View>

        {/* WebView for displaying documents */}
        <WebView
          source={{uri: getViewerUrl(encodedUrl)}}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
          scalesPageToFit={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          androidLayerType={Platform.select({
            android: 'hardware',
            default: undefined,
          })}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error:', nativeEvent);
          }}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView HTTP error:', nativeEvent);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default DocumentViewer;
