import { StyleSheet } from 'react-native'
import 'react-native-get-random-values';
import React, { StrictMode } from 'react'
import { PaperProvider } from 'react-native-paper'
import { theme } from './src/constants/theme'
import AppNavigator from './src/navigation/AppNavigator'
import { Provider } from "react-redux";
import { store } from './src/redux/store'

const App = () => {

  return (
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </PaperProvider>
  )
}

export default App

const stylesj = StyleSheet.create({})