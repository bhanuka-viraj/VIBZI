import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Platform, Linking, TouchableOpacity, Animated } from 'react-native';
import {
  Button,
  Text,
  Divider,
} from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { signInWithGoogle } from '../../redux/slices/authSlice';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingModal from '../../components/LoadingModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmailSignupForm from '../../components/EmailSignupForm';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- SignupScreen main component ---
const SignupScreen = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { error } = useSelector((state: RootState) => state.auth);

  // Animation refs
  const logoAnim = useRef(new Animated.Value(0)).current;
  const termsAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      await dispatch(signInWithGoogle()).unwrap();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google Sign-Up failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showEmailForm) {
      Animated.parallel([
        Animated.timing(logoAnim, { toValue: -6, duration: 400, useNativeDriver: true }),
        Animated.timing(termsAnim, { toValue: 6, duration: 400, useNativeDriver: true }),
        Animated.timing(formAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(logoAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(termsAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(formAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [showEmailForm]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      {showEmailForm && (
        <TouchableOpacity
          onPress={() => setShowEmailForm(false)}
          style={{
            position: 'absolute',
            left: 0,
            top: Platform.OS === 'ios' ? 50 : 20,
            zIndex: 100,
            padding: 10,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
      <LoadingModal visible={isLoading} message="Signing up" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Animated.View style={{ transform: [{ translateY: logoAnim }] }}>
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Create an account</Text>
              <Text style={styles.title}>Enter your information to create your account</Text>
            </View>
          </Animated.View>

          {!showEmailForm && (
            <>
              <Button
                mode="outlined"
                onPress={handleGoogleSignup}
                style={styles.googleButton}
                disabled={isLoading}
                icon={() => (
                  <Image
                    source={require('../../assets/g_logo.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                )}>
                Continue with Google
              </Button>
              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <Divider style={styles.divider} />
              </View>
              <Button
                mode="contained"
                onPress={() => setShowEmailForm(true)}
                style={styles.button}
              >
                Sign up with Email
              </Button>
            </>
          )}

          <Animated.View
            style={{
              opacity: formAnim,
              transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
              width: '100%',
            }}
          >
            {showEmailForm && <EmailSignupForm styles={styles} />}
          </Animated.View>

          <Animated.View style={{ transform: [{ translateY: termsAnim }] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
              <TouchableOpacity onPress={() => Linking.openURL('https://vibzi.co/terms')}>
                <Text style={[styles.termsLink, { textDecorationLine: 'underline' }]}>Terms and Conditions</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 4, color: '#666' }}>and</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://vibzi.co/privacy')}>
                <Text style={[styles.termsLink, { textDecorationLine: 'underline' }]}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login' as never)}
              style={{ alignSelf: 'center' }}
            >
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </Animated.View>
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
  termsContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  termsLink: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  googleButton: {
    marginBottom: 20,
    borderColor: '#E0E0E0',
  },
});

export default SignupScreen;
