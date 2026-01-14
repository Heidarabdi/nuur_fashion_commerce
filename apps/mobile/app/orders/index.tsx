import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useOrders } from '@nuur-fashion-commerce/api';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { spacing, fontFamilies, radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useRequireAuth } from '@/hooks';

// Simple date formatter
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

type FilterType = 'active' | 'completed' | 'returns';

export default function OrdersScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('active');

    // Require authentication
    const { isLoading: authLoading, isAuthenticated } = useRequireAuth();

    const filters: { key: FilterType; label: string }[] = [
        { key: 'active', label: 'Active' },
        { key: 'completed', label: 'Completed' },
        { key: 'returns', label: 'Returns' },
    ];

    // API hook
    const { data: ordersData, isLoading } = useOrders();
    const orders = ordersData || [];

    // Show loading while checking auth
    if (authLoading || !isAuthenticated) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Filter orders based on selected filter
    const filteredOrders = orders.filter((order: any) => {
        if (activeFilter === 'active') {
            return order.status === 'processing' || order.status === 'shipped' || order.status === 'pending';
        }
        if (activeFilter === 'completed') {
            return order.status === 'delivered';
        }
        if (activeFilter === 'returns') {
            return order.status === 'cancelled';
        }
        return true;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'delivered':
                return { bg: 'rgba(188, 108, 77, 0.1)', text: colors.primary };
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'delivered': return 'Delivered';
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                    <Text style={styles.title}>My Orders</Text>
                    <View style={styles.searchButton} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <Text style={styles.title}>My Orders</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={22} color={colors.text} />
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
                    {filteredOrders.map((order: any) => {
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
                                                <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
                                            </View>
                                            <View style={styles.arrowButton}>
                                                <Ionicons name="chevron-forward" size={18} color={colors.text} />
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
                        <Ionicons name="bag-outline" size={64} color={colors.textMuted} />
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
        color: colors.text,
        letterSpacing: -0.5,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
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
        borderColor: colors.border,
        backgroundColor: 'transparent',
    },
    filterPillActive: {
        backgroundColor: colors.text,
        borderColor: colors.text,
    },
    filterText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
    },
    filterTextActive: {
        color: colors.white,
        fontWeight: '600',
    },

    // Orders List
    ordersList: {
        gap: spacing.lg,
    },
    orderCard: {
        backgroundColor: colors.surface,
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
        backgroundColor: colors.accent,
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
        color: colors.text,
    },
    orderDate: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textMuted,
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
        color: colors.textMuted,
        textTransform: 'uppercase',
    },
    totalValue: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: colors.text,
        marginTop: 2,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
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
        color: colors.text,
        marginTop: spacing.lg,
    },
    emptySubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },
});
