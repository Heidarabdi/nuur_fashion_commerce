import React, { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button, CartItem, Divider } from '@/components/ui';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@nuur-fashion-commerce/api';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { spacing, fontFamilies, radius } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

export default function CartScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // API hooks
    const { data: cart, isLoading } = useCart();
    const updateCartItem = useUpdateCartItem();
    const removeFromCart = useRemoveFromCart();

    // Extract cart items from API response
    const cartItems = cart?.items || [];

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: any) => {
        const price = item.product?.price || item.variant?.price || 0;
        return sum + (price * item.quantity);
    }, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const handleQuantityChange = (itemId: string, quantity: number) => {
        updateCartItem.mutate({ itemId, quantity });
    };

    const handleRemoveItem = (itemId: string) => {
        removeFromCart.mutate(itemId);
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <Header title="Shopping Cart" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <Header title="Shopping Cart" showBack />
                <View style={styles.emptyContainer}>
                    <Ionicons name="bag-outline" size={64} color={colors.textMuted} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Start shopping to add items to your cart</Text>
                    <Button
                        variant="primary"
                        size="lg"
                        onPress={() => router.push('/(tabs)/shop')}
                        style={{ marginTop: spacing.lg }}
                    >
                        Browse Products
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Shopping Cart" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Cart Items */}
                <View style={styles.itemsContainer}>
                    {cartItems.map((item: any, index: number) => (
                        <React.Fragment key={item.id}>
                            <CartItem
                                item={{
                                    id: item.id,
                                    product: {
                                        id: item.product?.id || item.productId,
                                        name: item.product?.name || 'Product',
                                        price: item.product?.price || item.variant?.price || 0,
                                        image: item.product?.imageUrl || item.product?.images?.[0] || 'https://via.placeholder.com/100',
                                    },
                                    quantity: item.quantity,
                                    selectedColor: item.variant?.color || '',
                                    selectedSize: item.variant?.size || '',
                                }}
                                onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                                onRemove={() => handleRemoveItem(item.id)}
                            />
                            {index < cartItems.length - 1 && <Divider style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>

                {/* Promo Code */}
                <View style={styles.promoContainer}>
                    <TextInput
                        style={styles.promoInput}
                        placeholder="Promo code"
                        placeholderTextColor={colors.textMuted}
                    />
                    <Button variant="secondary" size="md" style={styles.promoButton}>
                        Apply
                    </Button>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                {/* Summary */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>Free</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                    </View>
                </View>

                <Button
                    variant="primary"
                    size="lg"
                    onPress={handleCheckout}
                    loading={updateCartItem.isPending || removeFromCart.isPending}
                >
                    Proceed to Checkout
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 24,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    itemsContainer: {
        gap: spacing.md,
    },
    divider: {
        marginVertical: spacing.md,
    },
    promoContainer: {
        flexDirection: 'row',
        marginTop: spacing.xl,
        gap: spacing.md,
    },
    promoInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.text,
    },
    promoButton: {
        minWidth: 80,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    summary: {
        marginBottom: spacing.lg,
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
    totalRow: {
        marginTop: spacing.sm,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    totalLabel: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: colors.text,
    },
    totalValue: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: colors.text,
    },
});
