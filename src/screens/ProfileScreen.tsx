import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Avatar,
  Text,
  Surface,
  List,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useAppDispatch } from '../redux/hooks';
import { signOut } from '../redux/slices/authSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import LoadingModal from '../components/LoadingModal';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  console.log('user from profile screen', user);

  const getInitials = (name: string) => {
    if (!name) return 'G';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      console.log('====================================');
      console.log('signing out');
      console.log('====================================');
      setIsLoading(true);
      await dispatch(signOut()).unwrap();
      console.log('====================================');
      console.log('signed out and navigating to login');
      console.log('====================================');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingModal visible={isLoading} message="Logging out" />
      <View style={styles.header}>
        {user?.picture ? (
          <Avatar.Image
            size={120}
            source={{ uri: user.picture }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={120}
            label={getInitials(user?.firstName || 'Guest')}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            color={theme.colors.onPrimary}
          />
        )}
        <Text variant="headlineMedium" style={styles.name}>
          {user?.firstName || 'Guest'} {user?.lastName || ''}
        </Text>
      </View>

      <Surface style={styles.section} elevation={1}>
        <List.Section>
          <List.Subheader>Personal Information</List.Subheader>
          <List.Item
            title="Email"
            description={user?.email || 'Not set'}
            left={props => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons
                    name="email"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Phone"
            description={user?.phone || 'Not set'}
            left={props => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Gender"
            description={user?.gender || 'Not set'}
            left={props => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons
                    name="gender-male-female"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Birth Date"
            description={user?.birthdate || 'Not set'}
            left={props => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              />
            )}
          />
        </List.Section>
      </Surface>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          icon="logout">
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  logoutButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
