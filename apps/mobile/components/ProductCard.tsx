import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

interface ProductCardProps {
    id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    onPress?: () => void;
}

export function ProductCard({ name, brand, price, image, onPress }: ProductCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity style={styles.heartButton}>
                    <IconSymbol name="heart" size={20} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <Text style={styles.brand}>{brand}</Text>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.price}>${price.toFixed(2)}</Text>
                <View style={styles.colors}>
                    <View style={[styles.colorDot, { backgroundColor: '#D2B48C' }]} />
                    <View style={[styles.colorDot, { backgroundColor: '#000000' }]} />
                    <View style={[styles.colorDot, { backgroundColor: '#556B2F' }]} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        aspectRatio: 0.75, // Vertical aspect ratio
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 6,
    },
    details: {
        padding: 12,
    },
    brand: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: '#000',
        marginBottom: 8,
    },
    colors: {
        flexDirection: 'row',
        gap: 6,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
