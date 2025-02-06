import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.header}>
    <Image
        source={require('../assets/images/icon.png')}
        resizeMode="contain"
        style={styles.logo}
    />
    <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatar}
    />
</View>
  )
}

export default Header

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor:'#fff'
    },
    logo: {
        height: 40,
        width: 120,
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 16,
    },
})