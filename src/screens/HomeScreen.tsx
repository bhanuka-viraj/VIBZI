import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Search from '../components/Search';
import RecentSuggestions from '../components/RecentSuggestions';
import { theme } from '../constants/theme';


const HomeScreen :React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/images/icon.png')}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <Image
                    source={require('../assets/images/avatar.png')}
                    style={styles.avatar}
                />
            </View>

            <Search />

            <Text style={[styles.title, theme.fonts.title]}>
                Recent suggestions for you
            </Text>
            <RecentSuggestions />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    logo: {
        height: 40,
        width: 120,
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 16,
    },
    title: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
});

export default HomeScreen;