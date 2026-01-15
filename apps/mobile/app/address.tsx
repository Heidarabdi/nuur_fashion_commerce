import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { spacing, fontFamilies, radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useRequireAuth } from '@/hooks';
import { useAddresses, useCreateAddress, useDeleteAddress } from '@nuur-fashion-commerce/api';

interface Address {
    id: string;
    type?: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}

export default function AddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // API hooks
    const { data: addresses = [], isLoading } = useAddresses();
    const createAddress = useCreateAddress();
    const deleteAddress = useDeleteAddress();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        phone: '',
        isDefault: false,
    });

    // Require authentication
    const { isLoading: authLoading, isAuthenticated } = useRequireAuth();

    // Set selected to default address when loaded
    React.useEffect(() => {
        if (addresses.length > 0 && !selectedId) {
            const defaultAddr = addresses.find((a: Address) => a.isDefault);
            setSelectedId(defaultAddr?.id || addresses[0]?.id);
        }
    }, [addresses, selectedId]);

    // Show loading while checking auth
    if (authLoading || !isAuthenticated) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteAddress.mutate(id, {
                            onSuccess: () => {
                                Toast.show({ type: 'success', text1: 'Address deleted' });
                                if (selectedId === id) setSelectedId(null);
                            },
                            onError: (error) => {
                                Toast.show({ type: 'error', text1: 'Failed to delete', text2: error.message });
                            }
                        });
                    }
                }
            ]
        );
    };

    const handleAddAddress = () => {
        if (!formData.firstName || !formData.lastName || !formData.addressLine1 || !formData.city || !formData.postalCode) {
            Toast.show({ type: 'error', text1: 'Fill required fields' });
            return;
        }

        createAddress.mutate({
            type: 'shipping',
            firstName: formData.firstName,
            lastName: formData.lastName,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || undefined,
            city: formData.city,
            state: formData.state || undefined,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone || undefined,
            isDefault: formData.isDefault,
        }, {
            onSuccess: () => {
                Toast.show({ type: 'success', text1: 'Address added!' });
                setShowAddModal(false);
                setFormData({
                    firstName: '', lastName: '', addressLine1: '', addressLine2: '',
                    city: '', state: '', postalCode: '', country: 'United States', phone: '', isDefault: false
                });
            },
            onError: (error) => {
                Toast.show({ type: 'error', text1: 'Failed to add', text2: error.message });
            }
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shipping Addresses</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
                    <Ionicons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : addresses.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl }}>
                    <Ionicons name="location-outline" size={64} color={colors.textMuted} />
                    <Text style={{ fontFamily: fontFamilies.sansSemiBold, fontSize: 18, color: colors.text, marginTop: spacing.lg }}>
                        No Addresses Yet
                    </Text>
                    <Text style={{ fontFamily: fontFamilies.sans, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
                        Add your first shipping address to get started
                    </Text>
                    <TouchableOpacity
                        style={{ marginTop: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.full }}
                        onPress={() => setShowAddModal(true)}
                    >
                        <Text style={{ fontFamily: fontFamilies.sansSemiBold, color: colors.white }}>Add Address</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
                    showsVerticalScrollIndicator={false}
                >
                    {addresses.map((address: Address) => (
                        <TouchableOpacity
                            key={address.id}
                            style={[styles.addressCard, selectedId === address.id && styles.addressCardSelected]}
                            onPress={() => handleSelect(address.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.addressHeader}>
                                <View style={styles.labelContainer}>
                                    <Ionicons
                                        name={address.type === 'billing' ? 'card-outline' : 'home-outline'}
                                        size={18}
                                        color={selectedId === address.id ? colors.primary : colors.text}
                                    />
                                    <Text style={[styles.addressLabel, selectedId === address.id && styles.addressLabelSelected]}>
                                        {address.type === 'billing' ? 'Billing' : 'Shipping'}
                                    </Text>
                                    {address.isDefault && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultBadgeText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.radioOuter, selectedId === address.id && styles.radioOuterSelected]}>
                                    {selectedId === address.id && <View style={styles.radioInner} />}
                                </View>
                            </View>

                            <Text style={styles.addressName}>{address.firstName} {address.lastName}</Text>
                            <Text style={styles.addressText}>{address.addressLine1}</Text>
                            {address.addressLine2 && <Text style={styles.addressText}>{address.addressLine2}</Text>}
                            <Text style={styles.addressText}>
                                {address.city}{address.state ? `, ${address.state}` : ''} {address.postalCode}
                            </Text>
                            <Text style={styles.addressText}>{address.country}</Text>
                            {address.phone && <Text style={styles.addressText}>{address.phone}</Text>}

                            <View style={styles.addressActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => Toast.show({ type: 'info', text1: 'Coming soon', text2: 'Edit functionality coming soon' })}
                                >
                                    <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleDelete(address.id)}
                                >
                                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                                    <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.addNewCard} onPress={() => setShowAddModal(true)}>
                        <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                        <Text style={styles.addNewText}>Add New Address</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {/* Add Address Modal */}
            <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
                <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowAddModal(false)}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Address</Text>
                        <TouchableOpacity onPress={handleAddAddress} disabled={createAddress.isPending}>
                            {createAddress.isPending ? (
                                <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                                <Text style={{ fontFamily: fontFamilies.sansSemiBold, color: colors.primary }}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1, padding: spacing.lg }}>
                        <View style={styles.inputRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>First Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.firstName}
                                    onChangeText={(t) => setFormData({ ...formData, firstName: t })}
                                    placeholder="John"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: spacing.md }}>
                                <Text style={styles.inputLabel}>Last Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.lastName}
                                    onChangeText={(t) => setFormData({ ...formData, lastName: t })}
                                    placeholder="Doe"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>Address Line 1 *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.addressLine1}
                            onChangeText={(t) => setFormData({ ...formData, addressLine1: t })}
                            placeholder="123 Main Street"
                            placeholderTextColor={colors.textMuted}
                        />

                        <Text style={styles.inputLabel}>Address Line 2</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.addressLine2}
                            onChangeText={(t) => setFormData({ ...formData, addressLine2: t })}
                            placeholder="Apt 4B (optional)"
                            placeholderTextColor={colors.textMuted}
                        />

                        <View style={styles.inputRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>City *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.city}
                                    onChangeText={(t) => setFormData({ ...formData, city: t })}
                                    placeholder="New York"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: spacing.md }}>
                                <Text style={styles.inputLabel}>State</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.state}
                                    onChangeText={(t) => setFormData({ ...formData, state: t })}
                                    placeholder="NY"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Postal Code *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.postalCode}
                                    onChangeText={(t) => setFormData({ ...formData, postalCode: t })}
                                    placeholder="10001"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: spacing.md }}>
                                <Text style={styles.inputLabel}>Country</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.country}
                                    onChangeText={(t) => setFormData({ ...formData, country: t })}
                                    placeholder="United States"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(t) => setFormData({ ...formData, phone: t })}
                            placeholder="+1 555 123 4567"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="phone-pad"
                        />

                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                        >
                            <Ionicons
                                name={formData.isDefault ? 'checkbox' : 'square-outline'}
                                size={24}
                                color={formData.isDefault ? colors.primary : colors.textMuted}
                            />
                            <Text style={{ marginLeft: spacing.sm, fontFamily: fontFamilies.sans, color: colors.text }}>
                                Set as default address
                            </Text>
                        </TouchableOpacity>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </View>
            </Modal>
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
    addButton: {
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
        paddingTop: spacing.md,
    },
    addressCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    addressCardSelected: {
        borderColor: colors.primary,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    addressLabel: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: colors.text,
    },
    addressLabelSelected: {
        color: colors.primary,
    },
    defaultBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
        marginLeft: spacing.xs,
    },
    defaultBadgeText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 10,
        color: colors.white,
        textTransform: 'uppercase',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    addressName: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    addressText: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.text,
        lineHeight: 22,
    },
    addressActions: {
        flexDirection: 'row',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    actionText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 13,
        color: colors.textSecondary,
    },
    addNewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    addNewText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: colors.primary,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 18,
        color: colors.text,
    },
    inputLabel: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        fontFamily: fontFamilies.sans,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputRow: {
        flexDirection: 'row',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
});
