import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {resetPassword, confirmResetPassword} from '@aws-amplify/auth';
import {theme} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    try {
      setLoading(true);
      setError('');
      await resetPassword({username: email});
      setIsCodeSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
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
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            disabled={isCodeSent}
          />

          {isCodeSent ? (
            <>
              <TextInput
                mode="outlined"
                label="Verification Code"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                keyboardType="number-pad"
              />
              <TextInput
                mode="outlined"
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
              />
            </>
          ) : null}

          <Button
            mode="contained"
            onPress={isCodeSent ? handleResetPassword : handleSendCode}
            loading={loading}
            style={styles.button}>
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
