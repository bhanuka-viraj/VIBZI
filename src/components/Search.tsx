// components/Search.tsx
import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
    Animated,
    Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants/theme';

interface SearchProps {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onBackPress?: () => void;
}

const Search = ({ style, placeholder, value, onChangeText, onBackPress }: SearchProps) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState(value || '');
    const animatedBorderWidth = React.useRef(new Animated.Value(1)).current;
    const animatedBorderColor = React.useRef(new Animated.Value(0)).current;
    const animatedIconColor = React.useRef(new Animated.Value(0)).current;
    const animatedScale = React.useRef(new Animated.Value(1)).current;
    const searchIconOpacity = React.useRef(new Animated.Value(1)).current;
    const backIconOpacity = React.useRef(new Animated.Value(0)).current;
    const inputRef = React.useRef<TextInput>(null);

    const handleChangeText = (text: string) => {
        setSearchQuery(text);
        if (onChangeText) {
            onChangeText(text);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        if (onChangeText) {
            onChangeText('');
        }
    };

    const handleIconPress = () => {
        if (isFocused) {
            inputRef.current?.blur();
            if (onBackPress) {
                onBackPress();
            }
        } else {
            inputRef.current?.focus();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);

        Animated.timing(searchIconOpacity, {
            toValue: 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => {

            Animated.timing(backIconOpacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        Animated.parallel([
            Animated.spring(animatedScale, {
                toValue: 1.02,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(animatedBorderWidth, {
                toValue: 2,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(animatedBorderColor, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(animatedIconColor, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handleBlur = () => {
        setIsFocused(false);

        Animated.timing(backIconOpacity, {
            toValue: 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => {

            Animated.timing(searchIconOpacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });


        Animated.parallel([
            Animated.spring(animatedScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(animatedBorderWidth, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(animatedBorderColor, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(animatedIconColor, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
        ]).start();
    };

    const interpolatedBorderColor = animatedBorderColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ccc', theme.colors.primary],
    });

    const interpolatedIconColor = animatedIconColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#757575', theme.colors.primary],
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.searchBar,
                    {
                        transform: [{ scale: animatedScale }],
                    },
                ]}>
                <Animated.View
                    style={[
                        styles.searchBarInner,
                        {
                            borderWidth: animatedBorderWidth,
                            borderColor: interpolatedBorderColor,
                        },
                    ]}>
                    <TouchableOpacity onPress={handleIconPress} style={styles.iconButton}>
                        <View style={styles.iconContainer}>
                            <Animated.View
                                style={[
                                    styles.iconWrapper,
                                    { opacity: searchIconOpacity }
                                ]}
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={22}
                                    color={interpolatedIconColor as any}
                                />
                            </Animated.View>
                            <Animated.View
                                style={[
                                    styles.iconWrapper,
                                    { opacity: backIconOpacity }
                                ]}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={22}
                                    color={theme.colors.primary}
                                />
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref={inputRef}
            placeholder={placeholder || 'Enter your destination'}
            value={searchQuery}
                        onChangeText={handleChangeText}
                        style={styles.input}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholderTextColor="#757575"
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Ionicons name="close" size={20} color="#757575" />
                        </TouchableOpacity>
                    ) : null}
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 16,
    },
    searchBar: {
        backgroundColor: 'transparent',
    },
    searchBarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 28,
        paddingHorizontal: 16,
        height: 48,
    },
    iconButton: {
        marginRight: 8,
        padding: 4,
    },
    iconContainer: {
        position: 'relative',
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        height: '100%',
        padding: 0,
    },
    clearButton: {
        padding: 4,
    },
});

export default Search;


