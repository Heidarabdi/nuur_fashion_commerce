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
import * as ImagePicker from 'expo-image-picker';

import { Button, Input } from '@/components/ui';
import { spacing, fontFamilies, shadows } from '@/constants/theme';
import { API_URL } from '@/constants/api';
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
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAvatarUri(user.image || null);
        }
    }, [user]);

    const pickImage = async () => {
        // Request permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Toast.show({ type: 'error', text1: 'Permission required', text2: 'Please allow access to photos' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setUploadingAvatar(true);
            try {
                // Upload the image
                const formData = new FormData();
                formData.append('file', {
                    uri: asset.uri,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                } as any);

                const response = await fetch(`${API_URL}/api/upload/avatar`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to upload avatar');
                }

                const data = await response.json();
                setAvatarUri(data.url);

                // Update user profile with new image
                await authClient.updateUser({ image: data.url });
                Toast.show({ type: 'success', text1: 'Avatar updated!' });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Upload failed',
                    text2: (error as Error).message
                });
            } finally {
                setUploadingAvatar(false);
            }
        }
    };

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
                            {avatarUri ? (
                                <Image
                                    source={{ uri: avatarUri }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: colors.white, fontSize: 48, fontWeight: 'bold' }}>
                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={pickImage}
                                disabled={uploadingAvatar}
                            >
                                {uploadingAvatar ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : (
                                    <Ionicons name="camera" size={16} color={colors.white} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={pickImage} disabled={uploadingAvatar}>
                            <Text style={styles.changePhotoText}>
                                {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                            </Text>
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
