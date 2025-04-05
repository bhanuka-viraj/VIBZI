import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isInitialized) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: isAuthenticated ? 'Main' : 'Login' }],
                });
            });
        }
    }, [navigation, isAuthenticated, isInitialized, fadeAnim]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').width * 0.5,
    },
});

export default SplashScreen; 