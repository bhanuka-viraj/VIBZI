// components/MainLayout.tsx
import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import Header from '../Header';
import {SafeAreaView} from 'react-native-safe-area-context';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const MainLayout = ({children, showHeader = true}: MainLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      {showHeader && <Header />}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MainLayout;
