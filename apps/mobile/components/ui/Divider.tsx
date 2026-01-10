import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { palette, spacing } from '@/constants/theme';

interface DividerProps {
    direction?: 'horizontal' | 'vertical';
    color?: string;
    thickness?: number;
    style?: ViewStyle;
}

export function Divider({
    direction = 'horizontal',
    color = palette.border,
    thickness = 1,
    style,
}: DividerProps) {
    return (
        <View
            style={[
                direction === 'horizontal' ? styles.horizontal : styles.vertical,
                { backgroundColor: color },
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
