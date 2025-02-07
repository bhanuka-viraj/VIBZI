import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Search from '../components/Search';
import RecentSuggestions from '../components/RecentSuggestions';
import { theme } from '../constants/theme';
import { Text } from 'react-native-paper';
import Header from '../components/Header';


const HomeScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Header/>
            <Search />

            <Text style={[styles.title]} variant='titleLarge'>
                Recent suggestions for you
            </Text>
            <RecentSuggestions />
        </SafeAreaView>
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
        color: '#000',
    },
});

export default HomeScreen;