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

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
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
                    { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={palette.text} />
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
                            <Ionicons name="mail-outline" size={32} color={palette.primary} />
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
                                onChangeText={setEmail}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
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
        color: palette.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
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
        color: palette.textSecondary,
    },
});
