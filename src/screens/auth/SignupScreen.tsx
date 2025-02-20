import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, TouchableRipple, HelperText } from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { signUp } from '../../redux/slices/authSlice';
import { theme } from '../../constants/theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RootStackParamList } from '../../navigation/AppNavigator';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleSignup = async () => {
    if (!username.trim() || !password.trim() || !email.trim() || 
        !givenName.trim() || !familyName.trim() || !gender.trim() || 
        !birthdate.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
    try {
      const result = await dispatch(signUp({ 
        username, 
        password, 
        email,
        givenName,
        familyName,
        gender,
        birthdate,
        phoneNumber
      })).unwrap();

      console.log('Signup result:', result);
      Alert.alert('Success', 'Please check your email for confirmation code');
      navigation.navigate('ConfirmSignup', { username });
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.name === 'UsernameExistsException') {
        Alert.alert(
          'Account Exists',
          'This account already exists. Would you like to confirm it?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Confirm Account',
              onPress: () => navigation.navigate('ConfirmSignup', { username })
            }
          ]
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
      <ScrollView>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="First Name"
          value={givenName}
          onChangeText={setGivenName}
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="Last Name"
          value={familyName}
          onChangeText={setFamilyName}
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="Birthdate (YYYY-MM-DD)"
          value={birthdate}
          onChangeText={setBirthdate}
          style={styles.input}
          disabled={loading}
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
          disabled={loading}
        />
        {error && <HelperText type="error">{error}</HelperText>}
        <Button 
          mode="contained" 
          onPress={handleSignup} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Sign Up
        </Button>
        <TouchableRipple onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableRipple>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: theme.colors.primary,
  },
  link: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: 10,
  },
});

export default SignupScreen; 