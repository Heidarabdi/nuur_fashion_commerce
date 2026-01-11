import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface DividerProps {
    direction?: 'horizontal' | 'vertical';
    color?: string;
    thickness?: number;
    style?: ViewStyle;
}

export function Divider({
    direction = 'horizontal',
    color,
    thickness = 1,
    style,
}: DividerProps) {
    const { colors } = useTheme();
    const dividerColor = color || colors.border;

    return (
        <View
            style={[
                direction === 'horizontal' ? styles.horizontal : styles.vertical,
                { backgroundColor: dividerColor },
                direction === 'horizontal' ? { height: thickness } : { width: thickness },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    horizontal: {
        width: '100%',
        marginVertical: spacing.sm,
    },
    vertical: {
        height: '100%',
        marginHorizontal: spacing.sm,
    },
});
