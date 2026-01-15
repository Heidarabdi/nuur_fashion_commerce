import React, { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, ListItem } from '@/components/ui';
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useRequireAuth } from '@/hooks';
import { authClient } from '@/lib/auth-client';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { isDark, toggleTheme, colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Require authentication
    const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    if (authLoading || !isAuthenticated || !user) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const menuItems = [
        { icon: 'bag-outline' as const, title: 'My Orders', route: '/orders' },
        { icon: 'heart-outline' as const, title: 'Wishlist', route: '/wishlist' },
        { icon: 'location-outline' as const, title: 'Shipping Address', route: '/address' },
        { icon: 'card-outline' as const, title: 'Payment Methods', route: '/payment' },
        { icon: 'settings-outline' as const, title: 'App Settings', route: '/settings' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 100 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.header}>
                    <Avatar
                        source={user.image || undefined}
                        name={user.name || 'User'}
                        size={96}
                        showEditBadge
                        onEditPress={() => router.push('/profile/edit' as any)}
                    />
                    <Text style={styles.name}>{user.name || 'User'}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>ORDERS</Text>
                    </View>
                    <View style={[styles.stat, styles.statBorder]}>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>WISHLIST</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>POINTS</Text>
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
                    <View style={styles.menuItems}>
                        {menuItems.map((item, index) => (
                            <ListItem
                                key={index}
                                title={item.title}
                                leftIcon={item.icon}
                                onPress={() => router.push(item.route as any)}
                                style={styles.menuItem}
                            />
                        ))}
                    </View>
                </View>

                {/* Promo Card */}
                {/* <Card variant="outline" padding="lg" style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <View style={styles.promoIcon}>
                            <Ionicons name="gift-outline" size={24} color={colors.white} />
                        </View>
                        <View style={styles.promoText}>
                            <Text style={styles.promoTitle}>Join Nuur Insider</Text>
                            <Text style={styles.promoSubtitle}>Unlock early access & free shipping</Text>
                        </View>
                    </View>
                </Card> */}
            </ScrollView>

            {/* Floating Theme Toggle Button - Top Right */}
            <TouchableOpacity
                style={[styles.themeToggle, { top: insets.top + spacing.md }]}
                onPress={toggleTheme}
                activeOpacity={0.8}
            >
                <Ionicons
                    name={isDark ? 'sunny-outline' : 'moon-outline'}
                    size={22}
                    color={colors.text}
                />
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    name: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 24,
        color: colors.text,
        marginTop: spacing.md,
    },
    email: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        marginBottom: spacing.xl,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border,
    },
    statValue: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: colors.text,
    },
    statLabel: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 10,
        letterSpacing: 1,
        color: colors.textMuted,
        marginTop: 2,
    },

    // Menu
    menuSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 11,
        letterSpacing: 2,
        color: colors.textMuted,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    menuItems: {
        gap: spacing.xs,
    },
    menuItem: {
        marginBottom: 0,
    },

    // Promo
    promoCard: {
        backgroundColor: colors.accent,
        borderColor: 'rgba(188, 108, 77, 0.1)',
    },
    promoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    promoIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    promoText: {
        flex: 1,
    },
    promoTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: colors.text,
    },
    promoSubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },

    // Floating Theme Toggle - Top Right
    themeToggle: {
        position: 'absolute',
        right: spacing.lg,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
});
