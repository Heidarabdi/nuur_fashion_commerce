import React, { useState } from 'react';
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

import { Button, Input } from '@/components/ui';
import { palette, spacing, fontFamilies } from '@/constants/theme';

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
            >
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
                        onChangeText={setEmail}
                    />

                    <Input
                        label="Password"
                        placeholder="Password"
                        isPassword
                        value={password}
                        onChangeText={setPassword}
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
                    rightIcon={<Ionicons name="arrow-forward" size={20} color={palette.white} />}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
    },

    // Logo
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logo: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 36,
        color: palette.text,
        letterSpacing: 2,
    },

    // Header
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 28,
        color: palette.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
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
        color: palette.primary,
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
        color: palette.textSecondary,
    },
    footerLink: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: palette.text,
    },
});
