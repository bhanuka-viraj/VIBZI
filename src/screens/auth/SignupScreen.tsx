import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  TouchableRipple,
  HelperText,
  Menu,
  Portal,
  Modal,
} from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { signUp } from '../../redux/slices/authSlice';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingModal from '../../components/LoadingModal';
import DatePicker from 'react-native-date-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleSignup = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !givenName.trim() ||
      !familyName.trim() ||
      !gender.trim()
    ) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const result = await dispatch(
        signUp({
          username: email, // Using email as username
          password,
          email,
          givenName,
          familyName,
          gender,
          birthdate: birthdate.toISOString().split('T')[0],
          phoneNumber: '', // Empty as it's not required
        }),
      ).unwrap();

      console.log('Signup result:', result);
      setIsLoading(false);
      Alert.alert('Success', 'Please check your email for confirmation code');
      navigation.navigate('ConfirmSignup', { username: email });
    } catch (error: any) {
      setIsLoading(false);
      console.error('Signup error:', error);
      if (error.name === 'UsernameExistsException') {
        Alert.alert(
          'Account Exists',
          'This account already exists. Would you like to confirm it?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Confirm Account',
              onPress: () => navigation.navigate('ConfirmSignup', { username: email }),
            },
          ],
        );
      } else {
        Alert.alert('Error', error.message || 'Signup failed');
      }
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <LoadingModal visible={isLoading} message="Signing up" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Create an account</Text>
            <Text style={styles.title}>Enter your information to create your account</Text>
          </View>

          <TextInput
            label="First Name"
            value={givenName}
            onChangeText={setGivenName}
            style={styles.input}
            disabled={isLoading}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor={theme.colors.primary}
            theme={{ colors: { background: 'white' } }}
            left={<TextInput.Icon icon="account-details" />}
          />
          <TextInput
            label="Last Name"
            value={familyName}
            onChangeText={setFamilyName}
            style={styles.input}
            disabled={isLoading}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor={theme.colors.primary}
            theme={{ colors: { background: 'white' } }}
            left={<TextInput.Icon icon="account-details" />}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            disabled={isLoading}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor={theme.colors.primary}
            theme={{ colors: { background: 'white' } }}
            left={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            disabled={isLoading}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor={theme.colors.primary}
            theme={{ colors: { background: 'white' } }}
            left={<TextInput.Icon icon="lock" />}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            disabled={isLoading}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor={theme.colors.primary}
            theme={{ colors: { background: 'white' } }}
            left={<TextInput.Icon icon="lock-check" />}
          />
          <Menu
            visible={showGenderMenu}
            onDismiss={() => setShowGenderMenu(false)}
            anchor={
              <TouchableRipple onPress={() => setShowGenderMenu(true)}>
                <View style={styles.input}>
                  <TextInput
                    label="Gender"
                    value={gender}
                    editable={false}
                    disabled={isLoading}
                    mode="outlined"
                    outlineColor="#E0E0E0"
                    activeOutlineColor={theme.colors.primary}
                    theme={{ colors: { background: 'white' } }}
                    left={<TextInput.Icon icon="gender-male-female" />}
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                </View>
              </TouchableRipple>
            }>
            <Menu.Item onPress={() => { setGender('Male'); setShowGenderMenu(false); }} title="Male" />
            <Menu.Item onPress={() => { setGender('Female'); setShowGenderMenu(false); }} title="Female" />
            <Menu.Item onPress={() => { setGender('Other'); setShowGenderMenu(false); }} title="Other" />
          </Menu>
          <TouchableRipple onPress={() => setShowDatePicker(true)}>
            <View style={styles.input}>
              <TextInput
                label="Birthday"
                value={birthdate.toLocaleDateString()}
                editable={false}
                disabled={isLoading}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={theme.colors.primary}
                theme={{ colors: { background: 'white' } }}
                left={<TextInput.Icon icon="calendar" />}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>
          </TouchableRipple>
          <DatePicker
            modal
            open={showDatePicker}
            date={birthdate}
            onConfirm={(date) => {
              setShowDatePicker(false);
              setBirthdate(date);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
            maximumDate={new Date()}
            mode="date"
            title="Select Birthday"
            confirmText="Confirm"
            cancelText="Cancel"
          />
          {error && <HelperText type="error">{error}</HelperText>}
          <Button
            mode="contained"
            onPress={handleSignup}
            style={styles.button}
            disabled={isLoading}>
            Sign Up
          </Button>
          <TouchableRipple onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableRipple>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 300,
    height: 50,
    marginBottom: 7,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: theme.colors.primary,
  },
  link: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});

export default SignupScreen;
