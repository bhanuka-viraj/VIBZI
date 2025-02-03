// components/Search.tsx
import React from 'react';
import { Searchbar } from 'react-native-paper';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

interface SearchProps {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
}

const Search = ({ style, placeholder }: SearchProps) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <Searchbar
            placeholder={placeholder || 'Enter your destination'}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, style]}
            inputStyle={{
                fontSize: 16,
                alignItems: 'center'
            }}
        />
    );
};

const styles = StyleSheet.create({
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 0,
        paddingVertical: 0,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 50,
        elevation: 0,
        shadowOpacity: 0,

    },
});

export default Search;


