import React, { useState, useMemo } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    isPassword?: boolean;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    isPassword = false,
    ...props
}: InputProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasError = !!error;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    hasError && styles.inputError,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? styles.inputWithLeftIcon : undefined,
                        (rightIcon || isPassword) ? styles.inputWithRightIcon : undefined,
                    ]}
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}

                {rightIcon && !isPassword && (
                    <View style={styles.iconRight}>{rightIcon}</View>
                )}
            </View>

            {(error || hint) && (
                <Text style={[styles.helperText, hasError && styles.errorText]}>
                    {error || hint}
                </Text>
            )}
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputFocused: {
        borderColor: colors.primary,
    },
    inputError: {
        borderColor: colors.error,
    },
    input: {
        flex: 1,
        fontFamily: fontFamilies.sans,
        fontSize: 16,
        color: colors.text,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    inputWithLeftIcon: {
        paddingLeft: spacing.xs,
    },
    inputWithRightIcon: {
        paddingRight: spacing.xs,
    },
    iconLeft: {
        paddingLeft: spacing.md,
    },
    iconRight: {
        paddingRight: spacing.md,
    },
    helperText: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    errorText: {
        color: colors.error,
    },
});
