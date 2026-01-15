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

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                throw new Error(error.message || 'Failed to login');
            }

            Toast.show({
                type: 'success',
                text1: 'Welcome back!',
                text2: 'You have been signed in successfully.',
            });

            router.replace('/(tabs)');
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Sign in failed',
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
                {/* Close Button - allows guest to go back without signing in */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>Nuur</Text>
                </View>

                {/* Welcome Text */}
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue to your personal wardrobe.</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        placeholder="Password"
                        isPassword
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        error={errors.password}
                    />

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => router.push('/auth/forgot-password' as any)}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Login Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onPress={handleLogin}
                    rightIcon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
                >
                    Login
                </Button>

                {/* Sign Up Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/signup' as any)}>
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
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
    closeButton: {
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
    },

    // Logo
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logo: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 36,
        color: colors.text,
        letterSpacing: 2,
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
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.primary,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: spacing.xl,
    },
    footerText: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
    },
    footerLink: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: colors.text,
    },
});
