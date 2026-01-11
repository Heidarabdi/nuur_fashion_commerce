import React, { useState, useMemo } from 'react';
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
import { spacing, fontFamilies, radius } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

export default function CartScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [cartItems, setCartItems] = useState(mockCartItems);
    const [promoCode, setPromoCode] = useState('');

    const subtotal = getCartTotal(cartItems);
    const shipping = 0; // Free shipping
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

                {/* Promo Code */}
                <View style={styles.promoContainer}>
                    <TextInput
                        style={styles.promoInput}
                        placeholder="Promo code"
                        placeholderTextColor={colors.textMuted}
                        value={promoCode}
                        onChangeText={setPromoCode}
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

                {/* Checkout Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleCheckout}
                    rightIcon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
                >
                    Checkout
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },

    // Items
    itemsContainer: {
        marginBottom: spacing.xl,
    },
    divider: {
        marginVertical: spacing.lg,
    },

    // Promo
    promoContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    promoInput: {
        flex: 1,
        backgroundColor: colors.accent,
        borderRadius: radius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.text,
    },
    promoButton: {
        paddingHorizontal: spacing.lg,
    },

    // Footer
    footer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },

    // Summary
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
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderStyle: 'dashed',
        marginTop: spacing.xs,
    },
    totalLabel: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: colors.text,
    },
    totalValue: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 20,
        color: colors.text,
    },
});
