import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import { palette, radius, spacing, fontFamilies } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
    leftIcon,
    rightIcon,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.base,
                styles[variant],
                styles[`size_${size}`],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            disabled={isDisabled}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? palette.white : palette.primary}
                />
            ) : (
                <>
                    {leftIcon}
                    <Text
                        style={[
                            styles.text,
                            styles[`${variant}Text`],
                            styles[`size_${size}_text`],
                            textStyle,
                        ]}
                    >
                        {children}
                    </Text>
                    {rightIcon}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        borderRadius: radius.full,
    },

    // Variants
    primary: {
        backgroundColor: palette.primary,
    },
    secondary: {
        backgroundColor: palette.text,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: palette.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    size_sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 36,
    },
    size_md: {
        paddingVertical: spacing.md - 4,
        paddingHorizontal: spacing.lg,
        minHeight: 48,
    },
    size_lg: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        minHeight: 56,
    },

    // Text styles
    text: {
        fontFamily: fontFamilies.sansSemiBold,
        letterSpacing: 0.5,
    },
    primaryText: {
        color: palette.white,
    },
    secondaryText: {
        color: palette.white,
    },
    outlineText: {
        color: palette.text,
    },
    ghostText: {
        color: palette.primary,
    },

    // Text sizes
    size_sm_text: {
        fontSize: 14,
    },
    size_md_text: {
        fontSize: 16,
    },
    size_lg_text: {
        fontSize: 18,
    },

    // States
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
});
