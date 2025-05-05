import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  TouchableRipple,
  HelperText,
} from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { signIn, setError } from '../../redux/slices/authSlice';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingModal from '../../components/LoadingModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen({ route }: any) {
  const { redirectTo } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !error) {
      setIsLoading(false);
      navigation.navigate('Main');
    } else if (error) {
      setIsLoading(false);
    }
  }, [isAuthenticated, error, navigation]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    setIsLoading(true);
    const result = await dispatch(signIn(username, password));

    if (result?.username) {
      Alert.alert(
        'Account Not Confirmed',
        'Your account is not confirmed yet. Would you like to confirm it now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
          {
            text: 'Confirm',
            onPress: () => navigation.navigate('ConfirmSignup', { username: result.username }),
          },
        ],
      );
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text.trim());
    if (error) dispatch(setError(null));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text.trim());
    if (error) dispatch(setError(null));
  };

  return (
    <View style={styles.container}>
      <LoadingModal visible={isLoading} />
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>

        <TextInput
          label="Email"
          value={username}
          onChangeText={handleUsernameChange}
          style={styles.input}
          disabled={isLoading}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          theme={{ colors: { background: 'white' } }}
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          style={styles.input}
          disabled={isLoading}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          theme={{ colors: { background: 'white' } }}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        {error && <HelperText type="error">{error}</HelperText>}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          disabled={isLoading}>
          Login
        </Button>
        <TouchableRipple
          onPress={() => navigation.navigate('ForgotPassword' as never)}
          style={styles.forgotPasswordLink}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableRipple>
        <TouchableRipple onPress={() => navigation.navigate('Signup' as never)}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableRipple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
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
  forgotPasswordLink: {
    marginBottom: 8,
  },
  link: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
});
