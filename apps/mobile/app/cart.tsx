import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button, CartItem, Divider } from '@/components/ui';
import { mockCartItems, getCartTotal, formatPrice } from '@/constants/mock-data';
import { palette, spacing, fontFamilies, radius } from '@/constants/theme';

export default function CartStandaloneScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [cartItems, setCartItems] = useState(mockCartItems);
    const [promoCode, setPromoCode] = useState('');

    const subtotal = getCartTotal(cartItems);
    const shipping = 0;
    const total = subtotal + shipping;

    const handleQuantityChange = (itemId: string, quantity: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const handleRemoveItem = (itemId: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <Header title="Shopping Cart" showBack />
                <View style={styles.emptyState}>
                    <Ionicons name="cart-outline" size={64} color={palette.textMuted} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Add items to start shopping
                    </Text>
                    <Button
                        variant="primary"
                        size="md"
                        onPress={() => router.push('/(tabs)/shop')}
                        style={{ marginTop: spacing.xl }}
                    >
                        Start Shopping
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
                <View style={styles.itemsContainer}>
                    {cartItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <CartItem
                                item={item}
                                onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                                onRemove={() => handleRemoveItem(item.id)}
                            />
                            {index < cartItems.length - 1 && <Divider style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>

                <View style={styles.promoContainer}>
                    <TextInput
                        style={styles.promoInput}
                        placeholder="Promo code"
                        placeholderTextColor={palette.textMuted}
                        value={promoCode}
                        onChangeText={setPromoCode}
                    />
                    <Button variant="secondary" size="md" style={styles.promoButton}>
                        Apply
                    </Button>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>Free</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                    </View>
                </View>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleCheckout}
                    rightIcon={<Ionicons name="arrow-forward" size={20} color={palette.white} />}
                >
                    Checkout
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    itemsContainer: {
        marginBottom: spacing.xl,
    },
    divider: {
        marginVertical: spacing.lg,
    },
    promoContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    promoInput: {
        flex: 1,
        backgroundColor: palette.accent,
        borderRadius: radius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.text,
    },
    promoButton: {
        paddingHorizontal: spacing.lg,
    },
    footer: {
        backgroundColor: palette.surface,
        borderTopWidth: 1,
        borderTopColor: palette.borderLight,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
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
        color: palette.textSecondary,
    },
    summaryValue: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: palette.text,
    },
    totalRow: {
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: palette.border,
        borderStyle: 'dashed',
        marginTop: spacing.xs,
    },
    totalLabel: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: palette.text,
    },
    totalValue: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 20,
        color: palette.text,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
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
