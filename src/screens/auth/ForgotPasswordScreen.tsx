import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { resetPassword, confirmResetPassword } from '@aws-amplify/auth';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import LoadingModal from '../../components/LoadingModal';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    setError('');
    setEmailError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword({ username: email });
      setIsCodeSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      navigation.navigate('Login' as never);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <LoadingModal
        visible={isLoading}
        message={isCodeSent ? 'Resetting password' : 'Sending code'}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            {isCodeSent ? 'Reset Password' : 'Forgot Password'}
          </Text>
          <Text style={styles.subtitle}>
            {isCodeSent
              ? 'Enter the verification code sent to your email'
              : 'Enter your email to receive a verification code'}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            disabled={isCodeSent || isLoading}
              error={!!emailError}
          />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {isCodeSent ? (
            <>
              <TextInput
                mode="outlined"
                label="Verification Code"
                value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setError('');
                  }}
                style={styles.input}
                keyboardType="number-pad"
                disabled={isLoading}
              />
              <TextInput
                mode="outlined"
                label="New Password"
                value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setError('');
                  }}
                secureTextEntry
                style={styles.input}
                disabled={isLoading}
              />
            </>
          ) : null}

          <Button
            mode="contained"
            onPress={isCodeSent ? handleResetPassword : handleSendCode}
            style={styles.button}
            disabled={isLoading}>
            {isCodeSent ? 'Reset Password' : 'Send Code'}
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login' as never)}
            style={styles.linkContainer}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  error: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: theme.colors.primary,
  },
});

export default ForgotPasswordScreen;
