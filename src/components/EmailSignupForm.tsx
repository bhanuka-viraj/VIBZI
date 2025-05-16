import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import {
    TextInput,
    Button,
    HelperText,
    Menu,
} from 'react-native-paper';
import { useAppDispatch } from '../redux/hooks';
import { signUp } from '../redux/slices/authSlice';
import { theme } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DatePicker from 'react-native-date-picker';

interface EmailSignupFormProps {
    onSuccess?: () => void;
    styles?: any;
}

const EmailSignupForm: React.FC<EmailSignupFormProps> = ({ onSuccess, styles }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [showGenderMenu, setShowGenderMenu] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

        if (password.trim() !== confirmPassword.trim()) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            const result = await dispatch(
                signUp({
                    username: email.trim(),
                    password: password.trim(),
                    email: email.trim(),
                    givenName: givenName.trim(),
                    familyName: familyName.trim(),
                    gender: gender.trim(),
                    birthdate: birthdate.toISOString().split('T')[0],
                    phoneNumber: '',
                }),
            ).unwrap();

            setIsLoading(false);
            Alert.alert('Success', 'Please check your email for confirmation code');
            navigation.navigate('ConfirmSignup', { username: email });
            onSuccess && onSuccess();
        } catch (error: any) {
            setIsLoading(false);
            if (error.name === 'UsernameExistsException') {
                Alert.alert(
                    'Account Exists',
                    'This account already exists. Would you like to confirm it?',
                    [
                        { text: 'Cancel', style: 'cancel' },
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
        <>
            <TextInput
                label="First Name"
                value={givenName}
                onChangeText={(text) => setGivenName(text.trim())}
                style={styles?.input}
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
                onChangeText={(text) => setFamilyName(text.trim())}
                style={styles?.input}
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
                onChangeText={(text) => setEmail(text.trim())}
                keyboardType="email-address"
                style={styles?.input}
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
                onChangeText={(text) => setPassword(text.trim())}
                secureTextEntry={!showPassword}
                style={styles?.input}
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
            <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text.trim())}
                secureTextEntry={!showConfirmPassword}
                style={styles?.input}
                disabled={isLoading}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={theme.colors.primary}
                theme={{ colors: { background: 'white' } }}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                    <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                }
            />
            <Menu
                visible={showGenderMenu}
                onDismiss={() => setShowGenderMenu(false)}
                anchor={
                    <TouchableOpacity onPress={() => setShowGenderMenu(true)}>
                        <View style={styles?.input}>
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
                                right={
                                    <TextInput.Icon
                                        icon="chevron-down"
                                        onPress={() => setShowGenderMenu(true)}
                                    />
                                }
                            />
                        </View>
                    </TouchableOpacity>
                }>
                <Menu.Item onPress={() => { setGender('Male'); setShowGenderMenu(false); }} title="Male" />
                <Menu.Item onPress={() => { setGender('Female'); setShowGenderMenu(false); }} title="Female" />
                <Menu.Item onPress={() => { setGender('Other'); setShowGenderMenu(false); }} title="Other" />
            </Menu>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View style={styles?.input}>
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
                    />
                </View>
            </TouchableOpacity>
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
                style={styles?.button}
                disabled={isLoading}>
                Sign Up
            </Button>
        </>
    );
};

export default EmailSignupForm; 