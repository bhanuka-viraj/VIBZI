import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  TouchableRipple,
  HelperText,
} from 'react-native-paper';
import {useAppDispatch} from '../../redux/hooks';
import {signIn} from '../../redux/slices/authSlice';
import {theme} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LoginScreen({route, navigation}: any) {
  const {redirectTo} = route.params || {};

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const {isAuthenticated, error, loading} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && redirectTo) {
      navigation.navigate(redirectTo);
    } else if (isAuthenticated) {
      navigation.navigate('MainTabs');
    }
  }, [isAuthenticated, navigation, redirectTo]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) return;
    dispatch(signIn(username, password));
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('MainTabs')}>
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Login</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          disabled={loading}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          theme={{colors: {background: 'white'}}}
          left={<TextInput.Icon icon="account" />}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          disabled={loading}
          mode="outlined"
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          theme={{colors: {background: 'white'}}}
          left={<TextInput.Icon icon="lock" />}
        />
        {error && <HelperText type="error">{error}</HelperText>}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}>
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    padding: 16,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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
