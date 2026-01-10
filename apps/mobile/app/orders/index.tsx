import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


import { mockOrders, formatDate, formatPrice, Order } from '@/constants/mock-data';
import { palette, spacing, fontFamilies, radius, shadows } from '@/constants/theme';

type FilterType = 'active' | 'completed' | 'returns';

export default function OrdersScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState<FilterType>('active');

    const filters: { key: FilterType; label: string }[] = [
        { key: 'active', label: 'Active' },
        { key: 'completed', label: 'Completed' },
        { key: 'returns', label: 'Returns' },
    ];

    // Filter orders based on selected filter
    const filteredOrders = mockOrders.filter((order) => {
        if (activeFilter === 'active') {
            return order.status === 'processing' || order.status === 'shipped';
        }
        if (activeFilter === 'completed') {
            return order.status === 'delivered';
        }
        if (activeFilter === 'returns') {
            return order.status === 'cancelled';
        }
        return true;
    });

    const getStatusStyle = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return { bg: 'rgba(188, 108, 77, 0.1)', text: palette.primary };
            case 'processing':
                return { bg: palette.accent, text: palette.textSecondary };
            case 'shipped':
                return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' };
            case 'cancelled':
                return { bg: 'rgba(239, 68, 68, 0.1)', text: palette.error };
            default:
                return { bg: palette.accent, text: palette.textSecondary };
        }
    };

    const getStatusLabel = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'Delivered';
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <Text style={styles.title}>My Orders</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={22} color={palette.text} />
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
                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[
                                styles.filterPill,
                                activeFilter === filter.key && styles.filterPillActive,
                            ]}
                            onPress={() => setActiveFilter(filter.key)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === filter.key && styles.filterTextActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Orders List */}
                <View style={styles.ordersList}>
                    {filteredOrders.map((order) => {
                        const statusStyle = getStatusStyle(order.status);
                        // Get first item image for display
                        const firstItem = order.items[0];

                        return (
                            <TouchableOpacity
                                key={order.id}
                                style={styles.orderCard}
                                activeOpacity={0.9}
                                onPress={() => router.push(`/orders/${order.id}` as any)}
                            >
                                <View style={styles.orderContent}>
                                    {/* Product Image */}
                                    <View style={styles.orderImageContainer}>
                                        <Image
                                            source={{ uri: firstItem?.image || 'https://via.placeholder.com/100' }}
                                            style={styles.orderImage}
                                            resizeMode="cover"
                                        />
                                    </View>

                                    {/* Order Details */}
                                    <View style={styles.orderDetails}>
                                        {/* Header Row: Order ID + Status */}
                                        <View style={styles.orderHeader}>
                                            <View>
                                                <Text style={styles.orderId}>Order #{order.id}</Text>
                                                <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                                            </View>
                                            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                                    {getStatusLabel(order.status)}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Footer Row: Total + Arrow */}
                                        <View style={styles.orderFooter}>
                                            <View>
                                                <Text style={styles.totalLabel}>TOTAL</Text>
                                                <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
                                            </View>
                                            <View style={styles.arrowButton}>
                                                <Ionicons name="chevron-forward" size={18} color={palette.text} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {filteredOrders.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="bag-outline" size={64} color={palette.textMuted} />
                        <Text style={styles.emptyTitle}>No orders found</Text>
                        <Text style={styles.emptySubtitle}>
                            You don&apos;t have any {activeFilter} orders yet.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 28,
        color: palette.text,
        letterSpacing: -0.5,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: palette.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },

    // Filters
    filtersContainer: {
        marginBottom: spacing.xl,
    },
    filtersContent: {
        gap: spacing.sm,
        paddingVertical: spacing.xs,
    },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: palette.border,
        backgroundColor: 'transparent',
    },
    filterPillActive: {
        backgroundColor: palette.text,
        borderColor: palette.text,
    },
    filterText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: palette.textSecondary,
    },
    filterTextActive: {
        color: palette.white,
        fontWeight: '600',
    },

    // Orders List
    ordersList: {
        gap: spacing.lg,
    },
    orderCard: {
        backgroundColor: palette.surface,
        borderRadius: 32,
        padding: spacing.md,
        ...shadows.sm,
    },
    orderContent: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    orderImageContainer: {
        width: 96,
        height: 96,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: palette.accent,
    },
    orderImage: {
        width: '100%',
        height: '100%',
    },
    orderDetails: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderId: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: palette.text,
    },
    orderDate: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: palette.textMuted,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radius.full,
    },
    statusText: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 12,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: spacing.md,
    },
    totalLabel: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 10,
        letterSpacing: 1,
        color: palette.textMuted,
        textTransform: 'uppercase',
    },
    totalValue: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: palette.text,
        marginTop: 2,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: palette.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxl * 2,
    },
    emptyTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 20,
        color: palette.text,
        marginTop: spacing.lg,
    },
    emptySubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },
});
