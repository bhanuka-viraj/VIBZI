import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppDispatch } from '../redux/hooks';
import { signOut } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await dispatch(signOut());
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4444'
  }
});

export default ProfileScreen;