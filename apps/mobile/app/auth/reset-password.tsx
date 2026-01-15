import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ token?: string }>();
    const token = params.token;
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const validateForm = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validateForm()) return;

        if (!token) {
            Toast.show({
                type: 'error',
                text1: 'Invalid reset link',
                text2: 'Please request a new password reset.',
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) {
                throw new Error(error.message || 'Failed to reset password');
            }

            setSuccess(true);
            Toast.show({
                type: 'success',
                text1: 'Password reset successful!',
                text2: 'You can now sign in with your new password.',
            });
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Failed to reset password',
                text2: (err as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Show invalid link state if no token
    if (!token) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.successContainer}>
                    <View style={[styles.successIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                        <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
                    </View>
                    <Text style={styles.successTitle}>Invalid Reset Link</Text>
                    <Text style={styles.successSubtitle}>
                        This password reset link is invalid or has expired. Please request a new one.
                    </Text>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => router.replace('/auth/forgot-password' as any)}
                        style={styles.successButton}
                    >
                        Request New Link
                    </Button>
                </View>
            </View>
        );
    }

    if (success) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
                    </View>
                    <Text style={styles.successTitle}>Password Reset!</Text>
                    <Text style={styles.successSubtitle}>
                        Your password has been reset successfully.
                    </Text>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => router.replace('/auth/login')}
                        style={styles.successButton}
                    >
                        Back to Login
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create New Password</Text>
                    <Text style={styles.subtitle}>
                        Your new password must be different from previously used passwords.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="New Password"
                        placeholder="Enter new password"
                        isPassword
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        error={errors.password}
                        hint="Must be at least 8 characters"
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        isPassword
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        error={errors.confirmPassword}
                    />
                </View>

                {/* Reset Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!password || !confirmPassword}
                    onPress={handleResetPassword}
                >
                    Reset Password
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
    },
    backButton: {
        marginBottom: spacing.lg,
    },

    // Header
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 28,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },

    // Form
    form: {
        marginBottom: spacing.xl,
    },

    // Success State
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    successIcon: {
        marginBottom: spacing.xl,
    },
    successTitle: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 28,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    successSubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    successButton: {
        marginTop: spacing.lg,
    },
});
