import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, ViewProps, StyleProp } from 'react-native';
import { radius, spacing, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

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
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    base: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
    },
    outline: {
        borderWidth: 1,
        borderColor: colors.border,
    },
});
