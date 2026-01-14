import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart, useCreateOrder } from '@nuur-fashion-commerce/api';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { useTheme } from '@/contexts/theme-context';
import { spacing, fontFamilies, radius } from '@/constants/theme';
import { useRequireAuth } from '@/hooks';

const SHIPPING_COST = 15;

export default function CheckoutScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Require authentication
    const { isLoading: authLoading, isAuthenticated } = useRequireAuth();

    // API hooks
    const { data: cartData, isLoading: isCartLoading } = useCart();
    const createOrder = useCreateOrder();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Calculate totals from cart
    const cartItems = cartData?.items || cartData || [];
    const subtotal = cartItems.reduce((sum: number, item: any) => {
        const price = parseFloat(item.product?.price) || 0;
        return sum + (price * item.quantity);
    }, 0);
    const total = subtotal + SHIPPING_COST;

    // Show loading while checking auth
    if (authLoading || !isAuthenticated) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    const handlePlaceOrder = async () => {
        if (!address || !city || !zip || !cardNumber) {
            Alert.alert('Error', 'Please fill in all details');
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }

        setIsPlacingOrder(true);
        try {
            await createOrder.mutateAsync({
                street: address,
                city,
                state: '',
                zip,
                country: 'US',
                email: 'customer@example.com',
                firstName: 'Customer',
                lastName: 'User',
            });

            Alert.alert('Success', 'Order placed successfully!', [
                { text: 'OK', onPress: () => router.push('/order-confirmation') }
            ]);
        } catch (error) {
            console.error('Failed to place order:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (isCartLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Street Address"
                            placeholderTextColor={colors.textMuted}
                            value={address}
                            onChangeText={setAddress}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                placeholder="City"
                                placeholderTextColor={colors.textMuted}
                                value={city}
                                onChangeText={setCity}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="ZIP Code"
                                placeholderTextColor={colors.textMuted}
                                value={zip}
                                onChangeText={setZip}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        <View style={styles.paymentCard}>
                            <Ionicons name="card-outline" size={24} color={colors.text} />
                            <TextInput
                                style={styles.cardInput}
                                placeholder="Card Number"
                                placeholderTextColor={colors.textMuted}
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="MM/YY"
                                placeholderTextColor={colors.textMuted}
                                value={expiry}
                                onChangeText={setExpiry}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="CVC"
                                placeholderTextColor={colors.textMuted}
                                value={cvc}
                                onChangeText={setCvc}
                                keyboardType="numeric"
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.summary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(SHIPPING_COST)}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, isPlacingOrder && styles.buttonDisabled]}
                        onPress={handlePlaceOrder}
                        disabled={isPlacingOrder}
                    >
                        <Text style={styles.buttonText}>
                            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.xs,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: fontFamilies.display,
        fontWeight: 'bold',
        color: colors.text,
    },
    content: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.md,
        color: colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        fontSize: 16,
        marginBottom: spacing.sm,
        backgroundColor: colors.surface,
        color: colors.text,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        gap: spacing.sm,
        backgroundColor: colors.surface,
    },
    cardInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    summary: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    summaryLabel: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.sm,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
