import React, { useEffect, useState } from 'react';
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
import ConfirmationDialog from '../components/ConfirmationDialog';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isAuthenticated, navigation]);

  const getInitials = (name: string) => {
    if (!name) return 'G';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogoutPress = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmation(false);
    dispatch(signOut());
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingModal visible={loading} message="Logging out" />
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
          onPress={handleLogoutPress}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          icon="logout"
          disabled={loading}>
          Logout
        </Button>
      </View>

      <ConfirmationDialog
        key={showLogoutConfirmation ? 'show' : 'hide'}
        visible={showLogoutConfirmation}
        onDismiss={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonStyle="primary"
      />
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
