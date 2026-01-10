import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { palette, spacing, fontFamilies, radius, shadows } from '@/constants/theme';

interface PaymentMethod {
    id: string;
    type: 'visa' | 'mastercard' | 'amex' | 'apple';
    lastFour: string;
    expiryDate: string;
    isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
    {
        id: '1',
        type: 'visa',
        lastFour: '4242',
        expiryDate: '12/26',
        isDefault: true,
    },
    {
        id: '2',
        type: 'mastercard',
        lastFour: '8888',
        expiryDate: '08/25',
        isDefault: false,
    },
];

const getCardIcon = (type: PaymentMethod['type']) => {
    switch (type) {
        case 'visa':
            return 'card-outline';
        case 'mastercard':
            return 'card-outline';
        case 'amex':
            return 'card-outline';
        case 'apple':
            return 'logo-apple';
        default:
            return 'card-outline';
    }
};

const getCardLabel = (type: PaymentMethod['type']) => {
    switch (type) {
        case 'visa':
            return 'Visa';
        case 'mastercard':
            return 'Mastercard';
        case 'amex':
            return 'American Express';
        case 'apple':
            return 'Apple Pay';
        default:
            return 'Card';
    }
};

export default function PaymentScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [paymentMethods] = useState(mockPaymentMethods);
    const [selectedId, setSelectedId] = useState(paymentMethods.find(p => p.isDefault)?.id);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={22} color={palette.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color={palette.primary} />
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
                {/* Cards Section */}
                <Text style={styles.sectionTitle}>Saved Cards</Text>

                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.paymentCard,
                            selectedId === method.id && styles.paymentCardSelected,
                        ]}
                        onPress={() => setSelectedId(method.id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIcon}>
                            <Ionicons
                                name={getCardIcon(method.type) as any}
                                size={28}
                                color={selectedId === method.id ? palette.primary : palette.text}
                            />
                        </View>

                        <View style={styles.cardDetails}>
                            <View style={styles.cardHeader}>
                                <Text style={[
                                    styles.cardType,
                                    selectedId === method.id && styles.cardTypeSelected,
                                ]}>
                                    {getCardLabel(method.type)}
                                </Text>
                                {method.isDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Text style={styles.defaultBadgeText}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.cardNumber}>•••• •••• •••• {method.lastFour}</Text>
                            <Text style={styles.cardExpiry}>Expires {method.expiryDate}</Text>
                        </View>

                        <View style={[
                            styles.radioOuter,
                            selectedId === method.id && styles.radioOuterSelected,
                        ]}>
                            {selectedId === method.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Other Payment Options */}
                <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Other Options</Text>

                <TouchableOpacity style={styles.otherOption}>
                    <View style={styles.optionIcon}>
                        <Ionicons name="logo-apple" size={24} color={palette.text} />
                    </View>
                    <Text style={styles.optionText}>Apple Pay</Text>
                    <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.otherOption}>
                    <View style={styles.optionIcon}>
                        <Ionicons name="logo-paypal" size={24} color="#003087" />
                    </View>
                    <Text style={styles.optionText}>PayPal</Text>
                    <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
                </TouchableOpacity>

                {/* Add New Card */}
                <TouchableOpacity style={styles.addNewCard}>
                    <Ionicons name="add-circle-outline" size={24} color={palette.primary} />
                    <Text style={styles.addNewText}>Add New Card</Text>
                </TouchableOpacity>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: palette.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    headerTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: palette.text,
    },
    addButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },

    // Section
    sectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: palette.textSecondary,
        marginBottom: spacing.md,
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Payment Card
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    paymentCardSelected: {
        borderColor: palette.primary,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: palette.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    cardDetails: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: 4,
    },
    cardType: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 16,
        color: palette.text,
    },
    cardTypeSelected: {
        color: palette.primary,
    },
    defaultBadge: {
        backgroundColor: palette.primary + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    defaultBadgeText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 10,
        color: palette.primary,
        textTransform: 'uppercase',
    },
    cardNumber: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        marginBottom: 2,
    },
    cardExpiry: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: palette.textMuted,
    },

    // Radio
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: palette.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: palette.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: palette.primary,
    },

    // Other Options
    otherOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: palette.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    optionText: {
        flex: 1,
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: palette.text,
    },

    // Add New
    addNewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: palette.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginTop: spacing.md,
        borderWidth: 2,
        borderColor: palette.border,
        borderStyle: 'dashed',
    },
    addNewText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: palette.primary,
    },
});
