import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { palette, spacing, fontFamilies } from '@/constants/theme';

interface NotificationItem {
    id: string;
    type: 'shipping' | 'promo' | 'reward' | 'return' | 'collection';
    title: string;
    message: string;
    time: string;
    image?: string;
    isNew?: boolean;
}

const newNotifications: NotificationItem[] = [
    {
        id: '1',
        type: 'shipping',
        title: 'Order #8291 Shipped',
        message: 'Your red silk coat is on the way. Track your package now.',
        time: '12m ago',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200',
        isNew: true,
    },
    {
        id: '2',
        type: 'promo',
        title: 'Price Drop Alert',
        message: 'The Silk Scarf you liked is now 20% off. Limited time only.',
        time: '1h ago',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
        isNew: true,
    },
];

const earlierNotifications: NotificationItem[] = [
    {
        id: '3',
        type: 'reward',
        title: 'Welcome to Platinum',
        message: "You've unlocked free express shipping on all orders.",
        time: 'Yesterday',
    },
    {
        id: '4',
        type: 'return',
        title: 'Return Processed',
        message: 'Refund of $320.00 has been initiated to your original payment method.',
        time: '2 days ago',
    },
    {
        id: '5',
        type: 'collection',
        title: 'Fall Collection Live',
        message: 'Explore the new neutrals. Early access for members starts now.',
        time: '3 days ago',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200',
    },
];

const getIconForType = (type: string) => {
    switch (type) {
        case 'shipping': return { icon: 'car-outline', color: palette.primary };
        case 'promo': return { icon: 'pricetag-outline', color: palette.primary };
        case 'reward': return { icon: 'star-outline', color: palette.primary };
        case 'return': return { icon: 'checkmark-circle-outline', color: '#22C55E' };
        case 'collection': return { icon: 'leaf-outline', color: palette.primary };
        default: return { icon: 'notifications-outline', color: palette.primary };
    }
};

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();

    const renderNotificationItem = (item: NotificationItem) => {
        const iconConfig = getIconForType(item.type);

        return (
            <TouchableOpacity key={item.id} style={styles.notificationItem}>
                <View style={styles.notificationLeft}>
                    {item.image ? (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.notificationImage}
                            />
                            <View style={[styles.iconBadge, { backgroundColor: palette.background }]}>
                                <Ionicons
                                    name={iconConfig.icon as any}
                                    size={12}
                                    color={iconConfig.color}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '15' }]}>
                            <Ionicons
                                name={iconConfig.icon as any}
                                size={24}
                                color={iconConfig.color}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.notificationTitle, item.isNew && styles.notificationTitleBold]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {item.isNew && <View style={styles.newDot} />}
                    </View>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                        {item.message}
                    </Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity>
                    <Text style={styles.markAllRead}>Mark all as read</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + spacing.xl },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* New Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>New</Text>
                    {newNotifications.map(renderNotificationItem)}
                </View>

                {/* Earlier Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Earlier</Text>
                    {earlierNotifications.map(renderNotificationItem)}
                </View>
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
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    headerTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 28,
        color: palette.text,
        letterSpacing: -0.5,
    },
    markAllRead: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 13,
        color: palette.textSecondary,
        paddingBottom: spacing.xs,
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: spacing.sm,
    },

    // Section
    section: {
        marginTop: spacing.md,
    },
    sectionTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 17,
        color: palette.text,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },

    // Notification Item
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
    },
    notificationLeft: {
        position: 'relative',
    },
    imageContainer: {
        position: 'relative',
    },
    notificationImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    iconBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: palette.white,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationContent: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    notificationTitle: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 15,
        color: palette.text,
        flex: 1,
    },
    notificationTitleBold: {
        fontFamily: fontFamilies.sansBold,
    },
    newDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: palette.primary,
    },
    notificationMessage: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        lineHeight: 20,
    },
    notificationTime: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: palette.textMuted,
        marginTop: 2,
    },
});
