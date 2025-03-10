import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
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

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {isAuthenticated, error, loading} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Home' as never);
    }
  }, [isAuthenticated, navigation]);

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
      <TouchableRipple onPress={() => navigation.navigate('Signup' as never)}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
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
  link: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: 10,
  },
});

export default LoginScreen;
