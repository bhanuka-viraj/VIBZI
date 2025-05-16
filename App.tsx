import { StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import React, { StrictMode } from 'react';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/constants/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { Amplify } from 'aws-amplify';
import config from './src/config/amplify-config.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import toastConfig from '@/config/toastConfig';

Amplify.configure(config);

const App = () => {
  return (
    <StrictMode>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
            <Toast config={toastConfig} />
          </GestureHandlerRootView>
        </Provider>
      </PaperProvider>
    </StrictMode>
  );
};

export default App;

const styles = StyleSheet.create({});
