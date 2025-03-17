import React from 'react';
import { View, StyleSheet } from 'react-native';
import Search from '../components/Search';
import RecentSuggestions from '../components/RecentSuggestions';
import { Text } from 'react-native-paper';

const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Search style={{marginHorizontal: 20}}/>
            <Text style={[styles.title]} variant='titleMedium'>
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
        color: '#000',
        fontSize: 18,
    },
});

export default HomeScreen;