import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="arrow.left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Order ID</Text>
                    <Text style={styles.value}>{id}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={[styles.status, { color: '#00a651' }]}>Delivered</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Items</Text>
                <View style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>The Essential Trench</Text>
                        <Text style={styles.itemVariant}>Size: M • Color: Beige</Text>
                    </View>
                    <Text style={styles.itemPrice}>$295.00</Text>
                </View>
                <View style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>Silk Slip Dress</Text>
                        <Text style={styles.itemVariant}>Size: S • Color: Black</Text>
                    </View>
                    <Text style={styles.itemPrice}>$120.00</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Subtotal</Text>
                    <Text style={styles.value}>$415.00</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Shipping</Text>
                    <Text style={styles.value}>$10.00</Text>
                </View>
                <View style={[styles.row, { marginTop: 8 }]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>$425.00</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e5e5',
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    itemInfo: {
        flex: 1,
        gap: 4,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemVariant: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
