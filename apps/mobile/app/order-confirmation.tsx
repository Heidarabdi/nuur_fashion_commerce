import React, { useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
} from 'react-native-reanimated';

import { Button } from '@/components/ui';
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

export default function OrderConfirmationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const checkScale = useSharedValue(0);
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        checkScale.value = withSpring(1, { damping: 10, stiffness: 100 });
        contentOpacity.value = withDelay(300, withSpring(1));
    }, [checkScale, contentOpacity]);

    const checkAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                {/* Success Animation */}
                <Animated.View style={[styles.iconContainer, checkAnimatedStyle]}>
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={60} color={colors.white} />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.textContent, contentAnimatedStyle]}>
                    <Text style={styles.title}>Order Confirmed!</Text>
                    <Text style={styles.subtitle}>
                        Thank you for your purchase. Your order has been placed successfully.
                    </Text>

                    <View style={styles.orderInfo}>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Order Number</Text>
                            <Text style={styles.orderValue}>#ORD-{Math.floor(Math.random() * 10000)}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Estimated Delivery</Text>
                            <Text style={styles.orderValue}>3-5 Business Days</Text>
                        </View>
                    </View>

                    <Text style={styles.emailText}>
                        A confirmation email has been sent to your email address.
                    </Text>
                </Animated.View>
            </View>

            <View style={styles.buttons}>
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/orders')}
                >
                    Track Order
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onPress={() => router.replace('/(tabs)')}
                >
                    Continue Shopping
                </Button>
            </View>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Icon
    iconContainer: {
        marginBottom: spacing.xl,
    },
    checkCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },

    // Text
    textContent: {
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 28,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: spacing.lg,
    },

    // Order Info
    orderInfo: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.lg,
        marginTop: spacing.xl,
        width: '100%',
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    orderLabel: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
    },
    orderValue: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: colors.text,
    },

    emailText: {
        fontFamily: fontFamilies.sans,
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.lg,
    },

    // Buttons
    buttons: {
        gap: spacing.md,
        paddingVertical: spacing.xl,
    },
});
