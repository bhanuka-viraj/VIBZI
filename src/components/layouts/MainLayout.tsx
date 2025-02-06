// components/MainLayout.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNav from '../BottomNavigation';
import Header from '../Header';

const MainLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>{children}</View>

            <View style={styles.bottomNav}>
                <BottomNav />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
    },
});

export default MainLayout;