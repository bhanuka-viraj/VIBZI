import { View, Text, StyleSheet } from 'react-native'
import React, { StrictMode } from 'react'
import { PaperProvider } from 'react-native-paper'
import { theme } from './src/constants/theme'
import AppNavigator from './src/navigation/AppNavigator'

const App = () => {

  return (
    <StrictMode>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </StrictMode>


  )
}

export default App

const stylesj = StyleSheet.create({})