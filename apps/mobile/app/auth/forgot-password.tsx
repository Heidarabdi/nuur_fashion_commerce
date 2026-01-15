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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const validateEmail = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        setError(undefined);
        return true;
    };

    const handleSubmit = async () => {
        if (!validateEmail()) return;

        setLoading(true);
        try {
            const { error: apiError } = await authClient.requestPasswordReset({
                email: email.trim(),
                redirectTo: '/auth/reset-password',
            });

            if (apiError) {
                throw new Error(apiError.message || 'Failed to send reset email');
            }

            setSent(true);
            Toast.show({
                type: 'success',
                text1: 'Reset email sent!',
                text2: 'Check your inbox for a password reset link.',
            });
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Failed to send reset email',
                text2: (err as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        {sent
                            ? 'Check your email for a reset link.'
                            : 'Enter your email to receive a password reset link.'}
                    </Text>
                </View>

                {sent ? (
                    <View style={styles.sentContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="mail-outline" size={32} color={colors.primary} />
                        </View>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={() => router.replace('/auth/login')}
                            style={{ marginTop: spacing.xl }}
                        >
                            Back to Login
                        </Button>
                    </View>
                ) : (
                    <>
                        {/* Form */}
                        <View style={styles.form}>
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (error) setError(undefined);
                                }}
                                error={error}
                            />
                        </View>

                        {/* Submit Button */}
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            onPress={handleSubmit}
                        >
                            Send Reset Link
                        </Button>
                    </>
                )}

                {/* Back Link */}
                {!sent && (
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.footerLink}>← Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    form: {
        marginBottom: spacing.xl,
    },
    sentContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(188, 108, 77, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    footerLink: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
    },
});
