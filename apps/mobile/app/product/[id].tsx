import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useProduct, useAddToCart } from '@nuur-fashion-commerce/api';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('#D2B48C');

    // Fetch product from API
    const { data: product, isLoading, error } = useProduct(id || '');
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        if (!product) return;

        // The shared useAddToCart uses variantId for size/color variants
        // For now, just add with productId and quantity
        addToCart.mutate({
            productId: product.id,
            quantity: 1,
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Product not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            {/* Full Screen Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.images?.[0]?.url || 'https://via.placeholder.com/400' }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Header Actions Overlay */}
                <SafeAreaView style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                        <IconSymbol name="arrow.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.rightActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <IconSymbol name="square.and.arrow.up" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <IconSymbol name="heart" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Content Sheet */}
            <View style={styles.contentContainer}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{product.name}</Text>
                        {product.rating && (
                            <View style={styles.ratingContainer}>
                                <IconSymbol name="star.fill" size={16} color="#FFD700" />
                                <Text style={styles.rating}>{product.rating}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>

                    {product.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </View>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Size</Text>
                            <View style={styles.sizeContainer}>
                                {product.sizes.map((size: string) => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[styles.sizeButton, selectedSize === size && styles.sizeButtonActive]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Color</Text>
                            <View style={styles.colorContainer}>
                                {product.colors.map((color: string) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorButton,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.colorButtonActive
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Sticky Bottom Bar */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[styles.addToCartButton, addToCart.isPending && styles.buttonDisabled]}
                        onPress={handleAddToCart}
                        disabled={addToCart.isPending}
                    >
                        {addToCart.isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    imageContainer: {
        height: '50%',
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerActions: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
    },
    rightActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        marginTop: -24,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        marginRight: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    rating: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 24,
        color: '#000',
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    sizeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    sizeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeButtonActive: {
        backgroundColor: '#C19A6B',
        borderColor: '#C19A6B',
    },
    sizeText: {
        fontSize: 16,
        color: '#000',
    },
    sizeTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    colorContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    colorButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    colorButtonActive: {
        borderWidth: 2,
        borderColor: '#000',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    addToCartButton: {
        backgroundColor: '#C19A6B',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
