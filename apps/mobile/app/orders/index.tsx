import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock Data
const ORDERS = [
    { id: 'ORD-001', date: '2023-11-15', total: 425.00, status: 'Delivered', items: 3 },
    { id: 'ORD-002', date: '2023-10-28', total: 120.00, status: 'Delivered', items: 1 },
    { id: 'ORD-003', date: '2023-09-10', total: 55.00, status: 'Cancelled', items: 1 },
];

export default function OrderHistoryScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof ORDERS[0] }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/orders/${item.id}` as any)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={[styles.status, item.status === 'Cancelled' ? styles.statusCancelled : styles.statusDelivered]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.orderDetails}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.itemCount}>{item.items} items</Text>
                <View style={styles.arrow}>
                    <IconSymbol name="chevron.right" size={16} color="#ccc" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="arrow.left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            <FlatList
                data={ORDERS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
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
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 8,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    statusDelivered: {
        backgroundColor: '#e6f7ed',
        color: '#00a651',
    },
    statusCancelled: {
        backgroundColor: '#fff0f0',
        color: '#e00000',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        color: '#666',
    },
    total: {
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9',
    },
    itemCount: {
        fontSize: 12,
        color: '#999',
    },
    arrow: {
        //
    },
});
