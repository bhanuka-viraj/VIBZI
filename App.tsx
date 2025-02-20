import { StyleSheet } from 'react-native'
import 'react-native-get-random-values';
import React, { StrictMode } from 'react'
import { PaperProvider } from 'react-native-paper'
import { theme } from './src/constants/theme'
import AppNavigator from './src/navigation/AppNavigator'
import { Provider } from "react-redux";
import { store } from './src/redux/store'
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './src/config/amplify-config';

// Configure Amplify
Amplify.configure(amplifyConfig);

const App = () => {
  return (
    <StrictMode>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </PaperProvider>
    </StrictMode>
  )
}

export default App

const styles = StyleSheet.create({})