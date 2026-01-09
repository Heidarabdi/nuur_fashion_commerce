import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CartScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Your Cart</Text>
                <Text style={styles.emptyText}>Your cart is empty.</Text>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/shop' as any)}>
                    <Text style={styles.buttonText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
