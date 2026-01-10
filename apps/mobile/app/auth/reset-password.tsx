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

export default function ResetPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Ionicons name="checkmark-circle" size={80} color={palette.primary} />
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
                    <Ionicons name="arrow-back" size={24} color={palette.text} />
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
                        onChangeText={setPassword}
                        hint="Must be at least 8 characters"
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        isPassword
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        error={
                            confirmPassword && password !== confirmPassword
                                ? 'Passwords do not match'
                                : undefined
                        }
                    />
                </View>

                {/* Reset Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!password || !confirmPassword || password !== confirmPassword}
                    onPress={handleResetPassword}
                >
                    Reset Password
                </Button>
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
        color: palette.text,
        marginBottom: spacing.sm,
    },
    successSubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    successButton: {
        marginTop: spacing.lg,
    },
});
