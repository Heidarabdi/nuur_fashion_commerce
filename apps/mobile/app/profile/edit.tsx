import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { spacing, fontFamilies, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { authClient } from '@/lib/auth-client';

export default function EditProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Get real user from session
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) {
            Toast.show({ type: 'error', text1: 'Name is required' });
            return;
        }

        setLoading(true);
        try {
            await authClient.updateUser({
                name: name.trim(),
            });
            Toast.show({ type: 'success', text1: 'Profile updated!' });
            router.back();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Update failed',
                text2: (error as Error).message
            });
        } finally {
            setLoading(false);
        }
    };

    if (isPending || !user) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.placeholder} />
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + 100 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {user.image ? (
                                <Image
                                    source={{ uri: user.image }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: colors.white, fontSize: 48, fontWeight: 'bold' }}>
                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={16} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setName}
                            rightIcon={<Ionicons name="person-outline" size={20} color={colors.textMuted} />}
                        />

                        {/* Email is read-only - requires separate change flow */}
                        <View style={{ marginTop: spacing.md }}>
                            <Text style={{ fontFamily: fontFamilies.sansMedium, fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>
                                Email Address
                            </Text>
                            <View style={{ backgroundColor: colors.surface, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1, fontFamily: fontFamilies.sans, fontSize: 16, color: colors.textMuted }}>
                                    {user.email}
                                </Text>
                                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Fixed Save Button */}
            <View style={[styles.saveButtonContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onPress={handleSave}
                >
                    Save Changes
                </Button>
            </View>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: colors.text,
    },
    placeholder: {
        width: 40,
    },

    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },

    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        borderColor: colors.surface,
        ...shadows.md,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.background,
    },
    changePhotoText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: colors.primary,
    },

    // Form
    form: {
        gap: spacing.sm,
    },

    // Save Button
    saveButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        backgroundColor: colors.background,
    },
});
