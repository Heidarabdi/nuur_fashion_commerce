import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps, StyleProp } from 'react-native';
import { palette, radius, spacing, shadows } from '@/constants/theme';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outline';
    padding?: keyof typeof spacing | number;
    style?: StyleProp<ViewStyle>;
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    style,
    ...props
}: CardProps) {
    const paddingValue = typeof padding === 'number' ? padding : spacing[padding];

    return (
        <View
            style={[
                styles.base,
                variant === 'elevated' && shadows.md,
                variant === 'outline' && styles.outline,
                { padding: paddingValue },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: palette.surface,
        borderRadius: radius.lg,
    },
    outline: {
        borderWidth: 1,
        borderColor: palette.border,
    },
});
