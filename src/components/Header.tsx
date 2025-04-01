import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Avatar, Text} from 'react-native-paper';
import {theme} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';

const Header = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();

  const getInitials = (name: string) => {
    if (!name) return 'G';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAvatarPress = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />

      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleAvatarPress}>
        {/* <Text style={styles.username}>{user?.firstName || 'Guest'}</Text> */}
        {user?.picture ? (
          <Avatar.Image
            size={35}
            source={{uri: user.picture}}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={35}
            label={getInitials(user?.firstName || 'Guest')}
            style={[styles.avatar, {backgroundColor: theme.colors.primary}]}
            color={theme.colors.onPrimary}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  logo: {
    height: 30,
    width: 90,

  },
  avatar: {
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
  },
});
