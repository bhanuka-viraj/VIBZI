import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Search from '../components/Search';
import RecentSuggestions from '../components/RecentSuggestions';
import { theme } from '../constants/theme';


const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Search />

            <Text style={[styles.title, theme.fonts.title]}>
                Recent suggestions for you
            </Text>
            <RecentSuggestions />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
});

export default HomeScreen;