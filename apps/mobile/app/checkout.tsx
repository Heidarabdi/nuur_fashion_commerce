import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CheckoutScreen() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePlaceOrder = () => {
        if (!address || !city || !zip || !cardNumber) {
            Alert.alert('Error', 'Please fill in all details');
            return;
        }

        // Simulate order placement
        Alert.alert('Success', 'Order placed successfully!', [
            { text: 'OK', onPress: () => router.push('/(tabs)' as any) }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="arrow.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Street Address"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                placeholder="City"
                                value={city}
                                onChangeText={setCity}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="ZIP Code"
                                value={zip}
                                onChangeText={setZip}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        <View style={styles.paymentCard}>
                            <IconSymbol name="creditcard" size={24} color="#000" />
                            <TextInput
                                style={styles.cardInput}
                                placeholder="Card Number"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="MM/YY"
                                value={expiry}
                                onChangeText={setExpiry}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="CVC"
                                value={cvc}
                                onChangeText={setCvc}
                                keyboardType="numeric"
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.summary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>$410.00</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={styles.summaryValue}>$15.00</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>$425.00</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
                        <Text style={styles.buttonText}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#fafafa',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        gap: 12,
        backgroundColor: '#fafafa',
    },
    cardInput: {
        flex: 1,
        fontSize: 16,
    },
    summary: {
        backgroundColor: '#f9f9f9',
        padding: 24,
        borderRadius: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        color: '#666',
        fontSize: 16,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e5e5',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
