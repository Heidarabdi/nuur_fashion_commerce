import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input } from '@/components/ui';
import { mockUser } from '@/constants/mock-data';
import { palette, spacing, fontFamilies, shadows } from '@/constants/theme';

export default function EditProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState(mockUser.name);
    const [email, setEmail] = useState(mockUser.email);
    const [phone, setPhone] = useState('+1 (555) 000-0000');
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1000);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={palette.text} />
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
                            <Image
                                source={{ uri: mockUser.avatar }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={16} color={palette.white} />
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
                            rightIcon={<Ionicons name="person-outline" size={20} color={palette.textMuted} />}
                        />

                        <Input
                            label="Email Address"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            rightIcon={<Ionicons name="mail-outline" size={20} color={palette.textMuted} />}
                        />

                        <Input
                            label="Phone Number"
                            placeholder="Enter your phone"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                            rightIcon={<Ionicons name="call-outline" size={20} color={palette.textMuted} />}
                        />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: palette.background,
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: palette.text,
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
        borderColor: palette.surface,
        ...shadows.md,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: palette.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: palette.background,
    },
    changePhotoText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: palette.primary,
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
        backgroundColor: palette.background,
    },
});
