import React, { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui';
import { mockOrders, formatDate, formatPrice, Order } from '@/constants/mock-data';
import { spacing, fontFamilies, radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const order = mockOrders.find((o) => o.id === id) || mockOrders[0];

    const getStatusStyle = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E' };
            case 'processing':
                return { bg: colors.accent, text: colors.textSecondary };
            case 'shipped':
                return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' };
            case 'cancelled':
                return { bg: 'rgba(239, 68, 68, 0.1)', text: colors.error };
            default:
                return { bg: colors.accent, text: colors.textSecondary };
        }
    };

    const statusStyle = getStatusStyle(order.status);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order #{order.id}</Text>
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
                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Text>
                    </View>
                    <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                    {order.trackingNumber && (
                        <View style={styles.trackingContainer}>
                            <Text style={styles.trackingLabel}>Tracking Number</Text>
                            <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
                        </View>
                    )}
                </View>

                {/* Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
                    {order.items.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                        </View>
                    ))}
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>{formatPrice(order.total - 10)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={styles.summaryValue}>$10.00</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                {order.status === 'delivered' && (
                    <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => { }}
                    >
                        Request Return
                    </Button>
                )}
            </ScrollView>
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    headerTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: colors.text,
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

    // Status Card
    statusCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        alignItems: 'center',
        ...shadows.sm,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: radius.full,
        marginBottom: spacing.sm,
    },
    statusText: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 14,
    },
    orderDate: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    trackingContainer: {
        alignItems: 'center',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        width: '100%',
    },
    trackingLabel: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 4,
    },
    trackingNumber: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: colors.text,
    },

    // Sections
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.md,
    },

    // Items
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: radius.md,
        backgroundColor: colors.accent,
    },
    itemDetails: {
        flex: 1,
        marginLeft: spacing.md,
    },
    itemName: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: colors.text,
    },
    itemQuantity: {
        fontFamily: fontFamilies.sans,
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 4,
    },
    itemPrice: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: colors.text,
    },

    // Summary
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    summaryLabel: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    totalLabel: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 16,
        color: colors.text,
    },
    totalValue: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 16,
        color: colors.text,
    },
});
