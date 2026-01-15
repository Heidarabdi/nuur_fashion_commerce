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
import ExpoCheckbox from 'expo-checkbox';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { authClient } from '@/lib/auth-client';

export default function SignupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

    const validateForm = () => {
        const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        if (!agreedToTerms) {
            Toast.show({
                type: 'info',
                text1: 'Terms Required',
                text2: 'Please agree to the Terms & Conditions',
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (error) {
                throw new Error(error.message || 'Failed to sign up');
            }

            Toast.show({
                type: 'success',
                text1: 'Account created!',
                text2: 'Welcome to Nuur Fashion Commerce.',
            });

            router.replace('/(tabs)');
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Sign up failed',
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
                    { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the community of style.</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="Full Name"
                        autoCapitalize="words"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        error={errors.name}
                    />

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
                        hint="Min. 8 characters"
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        isPassword
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        error={errors.confirmPassword}
                    />

                    {/* Terms Checkbox */}
                    <View style={styles.termsContainer}>
                        <ExpoCheckbox
                            value={agreedToTerms}
                            onValueChange={setAgreedToTerms}
                            color={agreedToTerms ? colors.primary : undefined}
                            style={styles.checkbox}
                        />
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={styles.termsLink}>Terms & Conditions</Text>
                        </Text>
                    </View>
                </View>

                {/* Sign Up Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!agreedToTerms}
                    onPress={handleSignup}
                >
                    Sign Up
                </Button>

                {/* Login Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text style={styles.footerLink}>Login</Text>
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    checkbox: {
        marginRight: spacing.sm,
        borderRadius: 4,
    },
    termsText: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
    },
    termsLink: {
        fontFamily: fontFamilies.sansMedium,
        color: colors.text,
        textDecorationLine: 'underline',
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
        color: colors.primary,
    },
});
