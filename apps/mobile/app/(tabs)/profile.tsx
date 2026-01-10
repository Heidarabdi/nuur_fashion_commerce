import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, ListItem, Card } from '@/components/ui';
import { mockUser } from '@/constants/mock-data';
import { palette, spacing, fontFamilies } from '@/constants/theme';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

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
                        source={mockUser.avatar}
                        name={mockUser.name}
                        size={96}
                        showEditBadge
                        onEditPress={() => router.push('/profile/edit' as any)}
                    />
                    <Text style={styles.name}>{mockUser.name}</Text>
                    <Text style={styles.email}>{mockUser.email}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{mockUser.ordersCount}</Text>
                        <Text style={styles.statLabel}>ORDERS</Text>
                    </View>
                    <View style={[styles.stat, styles.statBorder]}>
                        <Text style={styles.statValue}>{mockUser.wishlistCount}</Text>
                        <Text style={styles.statLabel}>WISHLIST</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {mockUser.points >= 1000 ? `${(mockUser.points / 1000).toFixed(1)}k` : mockUser.points}
                        </Text>
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
                <Card variant="outline" padding="lg" style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <View style={styles.promoIcon}>
                            <Ionicons name="gift-outline" size={24} color={palette.white} />
                        </View>
                        <View style={styles.promoText}>
                            <Text style={styles.promoTitle}>Join Nuur Insider</Text>
                            <Text style={styles.promoSubtitle}>Unlock early access & free shipping</Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
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
        color: palette.text,
        marginTop: spacing.md,
    },
    email: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
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
        borderColor: palette.border,
    },
    statValue: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: palette.text,
    },
    statLabel: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 10,
        letterSpacing: 1,
        color: palette.textMuted,
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
        color: palette.textMuted,
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
        backgroundColor: 'rgba(188, 108, 77, 0.05)',
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
        backgroundColor: palette.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    promoText: {
        flex: 1,
    },
    promoTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: palette.text,
    },
    promoSubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: palette.textSecondary,
        marginTop: 2,
    },
});
