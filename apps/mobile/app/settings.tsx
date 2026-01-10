import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ListItem } from '@/components/ui';
import { palette, spacing, fontFamilies, shadows, radius } from '@/constants/theme';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={22} color={palette.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + spacing.xl },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.sectionCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="notifications-outline" size={22} color={palette.text} />
                                <Text style={styles.settingLabel}>Push Notifications</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: palette.border, true: palette.primary }}
                                thumbColor={palette.white}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="moon-outline" size={22} color={palette.text} />
                                <Text style={styles.settingLabel}>Dark Mode</Text>
                            </View>
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: palette.border, true: palette.primary }}
                                thumbColor={palette.white}
                            />
                        </View>
                    </View>
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionCard}>
                        <ListItem
                            title="Change Password"
                            leftIcon={<Ionicons name="lock-closed-outline" size={22} color={palette.text} />}
                            showArrow
                            onPress={() => router.push('/auth/reset-password' as any)}
                        />
                        <View style={styles.divider} />
                        <ListItem
                            title="Shipping Addresses"
                            leftIcon={<Ionicons name="location-outline" size={22} color={palette.text} />}
                            showArrow
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <ListItem
                            title="Payment Methods"
                            leftIcon={<Ionicons name="card-outline" size={22} color={palette.text} />}
                            showArrow
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.sectionCard}>
                        <ListItem
                            title="Help Center"
                            leftIcon={<Ionicons name="help-circle-outline" size={22} color={palette.text} />}
                            showArrow
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <ListItem
                            title="Privacy Policy"
                            leftIcon={<Ionicons name="shield-checkmark-outline" size={22} color={palette.text} />}
                            showArrow
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <ListItem
                            title="Terms of Service"
                            leftIcon={<Ionicons name="document-text-outline" size={22} color={palette.text} />}
                            showArrow
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/auth/login')}>
                    <Ionicons name="log-out-outline" size={22} color={palette.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: palette.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    headerTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: palette.text,
    },
    placeholder: {
        width: 40,
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },

    // Section
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: palette.textSecondary,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: palette.surface,
        borderRadius: radius.xl,
        paddingVertical: spacing.xs,
        ...shadows.sm,
    },

    // Settings Row
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    settingLabel: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 16,
        color: palette.text,
    },
    divider: {
        height: 1,
        backgroundColor: palette.border,
        marginHorizontal: spacing.lg,
    },

    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.lg,
        marginTop: spacing.md,
    },
    logoutText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: palette.error,
    },

    // Version
    versionText: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: palette.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
