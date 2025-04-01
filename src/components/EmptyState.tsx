import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { IconButton } from 'react-native-paper';

type EmptyStateProps = {
    icon?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    date?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'calendar-plus',
    title = 'No Plans Yet',
    subtitle,
    description = 'Tap the + button below to add your first activity',
    date,
}) => {
    return (
        <View style={styles.container}>
            <IconButton
                icon={icon}
                size={64}
                iconColor={theme.colors.onSurface}
                style={styles.icon}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
                {subtitle || (date
                    ? `No activities planned for ${date}`
                    : 'No activities available for this date')}
            </Text>
            <Text style={styles.description}>
                {description}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
        minHeight: 300,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.secondary,
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: theme.colors.secondary,
        textAlign: 'center',
    },
});

export default EmptyState; 