import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { confirmSignUp, resendSignUpCode } from '@aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';

const ConfirmSignupScreen = ({ route }: { route: any }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { username } = route.params;

  const handleConfirm = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter confirmation code');
      return;
    }

    try {
      setLoading(true);
      await confirmSignUp({
        username,
        confirmationCode: code
      });
      Alert.alert('Success', 'Email confirmed! Please login.');
      navigation.navigate('Login' as never);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      await resendSignUpCode({ username });
      Alert.alert('Success', 'A new confirmation code has been sent to your email');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Email</Text>
      <Text style={styles.subtitle}>Please enter the confirmation code sent to your email</Text>
      <TextInput
        label="Confirmation Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        disabled={loading}
      />
      <Button
        mode="contained"
        onPress={handleConfirm}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Confirm
      </Button>
      <Button
        mode="text"
        onPress={handleResendCode}
        style={styles.resendButton}
        disabled={loading}
      >
        Resend Code
      </Button>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: theme.colors.primary,
  },
  resendButton: {
    marginTop: 10,
  },
});

export default ConfirmSignupScreen; 