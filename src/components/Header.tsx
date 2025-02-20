import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const Header = () => {
    const { user } = useSelector((state: RootState) => state.auth)
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/icon.png')}
        resizeMode="contain"
        style={styles.logo}
      />
      
      <View style={styles.avatarContainer}>
        <Text style={styles.username}>{user?.firstName || 'Guest'}</Text>
        <Image
          source={require('../assets/images/avatar.png')}
          style={styles.avatar}
        />
      </View>
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
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    username: {
        fontSize: 16,
        color: '#333',
    }
})