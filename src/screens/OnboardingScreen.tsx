import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform,
    SafeAreaView,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../redux/hooks';
import { completeOnboarding } from '../redux/slices/appSlice';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const AnimatedFlatList = Animated.createAnimatedComponent<typeof FlatList>(FlatList);

const onboardingData: OnboardingItem[] = [
    {
        id: '1',
        title: 'Plan Your Perfect Trip',
        description: 'Create detailed itineraries, add activities, and organize your travel plans all in one place.',
        icon: 'map',
    },
    {
        id: '2',
        title: 'Track Everything',
        description: 'Keep track of bookings, reservations, and important travel documents effortlessly.',
        icon: 'check-circle',
    },
    {
        id: '3',
        title: 'Travel with Confidence',
        description: 'Access your travel plans offline and get real-time updates for a stress-free journey.',
        icon: 'flight',
    },
];

const OnboardingScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList<OnboardingItem>>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
        )(event);
    };

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            scrollTo(currentIndex + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        try {
            await dispatch(completeOnboarding()).unwrap();
            navigation.replace('Signup');
        } catch (error) {
            console.error('Error completing onboarding:', error);
        }
    };

    const renderItem: ListRenderItem<OnboardingItem> = ({ item, index }) => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
        });

        return (
            <View style={styles.slide}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale }], opacity }]}>
                    <MaterialIcons name={item.icon} size={80} color={theme.colors.primary} />
                </Animated.View>
                <Animated.Text style={[styles.title, { opacity }]}>{item.title}</Animated.Text>
                <Animated.Text style={[styles.description, { opacity }]}>{item.description}</Animated.Text>
            </View>
        );
    };

    const Paginator = () => {
        return (
            <View style={styles.paginationContainer}>
                {onboardingData.map((_, index) => {
                    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index.toString()}
                            style={[
                                styles.dot,
                                { width: dotWidth, opacity },
                                { backgroundColor: theme.colors.primary },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    const scrollTo = (index: number) => {
        if (slidesRef.current) {
            slidesRef.current.scrollToIndex({ index });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.flatListContainer}>
                <FlatList
                    data={onboardingData}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.bottomContainer}>
                <Paginator />
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
                {currentIndex < onboardingData.length - 1 && (
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleFinish}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    flatListContainer: {
        flex: 3,
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 150,
        height: 150,
        backgroundColor: theme.colors.surface,
        borderRadius: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: theme.colors.onSurface,
    },
    description: {
        fontSize: 16,
        color: theme.colors.secondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    button: {
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        alignItems: 'center',
        padding: 10,
    },
    skipText: {
        color: theme.colors.secondary,
        fontSize: 16,
    },
});

export default OnboardingScreen; 