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

interface Address {
    id: string;
    label: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

const mockAddresses: Address[] = [
    {
        id: '1',
        label: 'Home',
        name: 'Elena Nuur',
        street: '123 Fashion Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        isDefault: true,
    },
    {
        id: '2',
        label: 'Office',
        name: 'Elena Nuur',
        street: '456 Business Center',
        city: 'New York',
        state: 'NY',
        zip: '10022',
        country: 'United States',
        isDefault: false,
    },
];

export default function AddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [addresses] = useState(mockAddresses);
    const [selectedId, setSelectedId] = useState(addresses.find(a => a.isDefault)?.id);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

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
                <Text style={styles.headerTitle}>Shipping Addresses</Text>
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
                {addresses.map((address) => (
                    <TouchableOpacity
                        key={address.id}
                        style={[
                            styles.addressCard,
                            selectedId === address.id && styles.addressCardSelected,
                        ]}
                        onPress={() => handleSelect(address.id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.addressHeader}>
                            <View style={styles.labelContainer}>
                                <Ionicons
                                    name={address.label === 'Home' ? 'home-outline' : 'business-outline'}
                                    size={18}
                                    color={selectedId === address.id ? palette.primary : palette.text}
                                />
                                <Text style={[
                                    styles.addressLabel,
                                    selectedId === address.id && styles.addressLabelSelected,
                                ]}>
                                    {address.label}
                                </Text>
                                {address.isDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Text style={styles.defaultBadgeText}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <View style={[
                                styles.radioOuter,
                                selectedId === address.id && styles.radioOuterSelected,
                            ]}>
                                {selectedId === address.id && <View style={styles.radioInner} />}
                            </View>
                        </View>

                        <Text style={styles.addressName}>{address.name}</Text>
                        <Text style={styles.addressText}>{address.street}</Text>
                        <Text style={styles.addressText}>
                            {address.city}, {address.state} {address.zip}
                        </Text>
                        <Text style={styles.addressText}>{address.country}</Text>

                        <View style={styles.addressActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="create-outline" size={18} color={palette.textSecondary} />
                                <Text style={styles.actionText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="trash-outline" size={18} color={palette.error} />
                                <Text style={[styles.actionText, { color: palette.error }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Add New Address Button */}
                <TouchableOpacity style={styles.addNewCard}>
                    <Ionicons name="add-circle-outline" size={24} color={palette.primary} />
                    <Text style={styles.addNewText}>Add New Address</Text>
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

    // Address Card
    addressCard: {
        backgroundColor: palette.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    addressCardSelected: {
        borderColor: palette.primary,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    addressLabel: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 16,
        color: palette.text,
    },
    addressLabelSelected: {
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

    // Address Details
    addressName: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: palette.text,
        marginBottom: 4,
    },
    addressText: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        lineHeight: 20,
    },

    // Actions
    addressActions: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: palette.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    actionText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: palette.textSecondary,
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
