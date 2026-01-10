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
import ExpoCheckbox from 'expo-checkbox';

import { Button, Input } from '@/components/ui';
import { palette, spacing, fontFamilies } from '@/constants/theme';

export default function SignupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        // Simulate signup
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
                        onChangeText={setName}
                    />

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
                        hint="Min. 8 characters"
                    />

                    {/* Terms Checkbox */}
                    <View style={styles.termsContainer}>
                        <ExpoCheckbox
                            value={agreedToTerms}
                            onValueChange={setAgreedToTerms}
                            color={agreedToTerms ? palette.primary : undefined}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
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
        color: palette.textSecondary,
        flex: 1,
    },
    termsLink: {
        fontFamily: fontFamilies.sansMedium,
        color: palette.text,
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
        color: palette.textSecondary,
    },
    footerLink: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: palette.primary,
    },
});
