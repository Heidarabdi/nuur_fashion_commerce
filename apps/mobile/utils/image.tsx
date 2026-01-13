/**
 * Image Utilities
 * Centralized image handling for the Nuur Fashion mobile app
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

// Project colors
const PLACEHOLDER_TEXT = '#FFFFFF'; // white text for contrast

// Pastel color palette for placeholders (generates variety while staying on-brand)
const PASTEL_COLORS = [
    '#D4A088', // light terracotta
    '#9A5539', // dark terracotta
    '#8B7355', // warm brown
    '#A18276', // dusty rose
    '#6B8E8E', // teal muted
    '#7D8C7D', // sage green
    '#8E8E9A', // cool gray purple
];

/**
 * Transform placeholder URLs to working React Native compatible URLs
 * Also validates that URL is a string
 */
export function transformImageUrl(url: string | undefined | null): string | null {
    if (!url || typeof url !== 'string') return null;

    // Skip placeholder URLs - they don't render in RN
    if (url.includes('placehold.co') ||
        url.includes('placeholder.com') ||
        url.includes('via.placeholder')) {
        return null;
    }

    return url;
}

/**
 * Get image URL from various product data structures
 */
export function getProductImageUrl(product: any): string | null {
    if (!product) return null;

    // Try images array first
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0];
        const url = typeof firstImage === 'string' ? firstImage : firstImage?.url;
        if (url) return transformImageUrl(url);
    }

    // Try image field (can be string or object)
    if (product.image) {
        if (typeof product.image === 'string') {
            return transformImageUrl(product.image);
        }
        if (typeof product.image === 'object' && 'url' in product.image) {
            return transformImageUrl(product.image.url);
        }
    }

    // Try imageUrl as fallback
    if (product.imageUrl) {
        return transformImageUrl(product.imageUrl);
    }

    return null;
}

interface PlaceholderImageProps {
    name?: string;
    width?: number;
    height?: number;
    style?: ViewStyle;
}

/**
 * Custom placeholder image component with product name
 * Uses random pastel color based on product name for variety
 */
export function PlaceholderImage({
    name = 'Product',
    width,
    height,
    style
}: PlaceholderImageProps) {
    // Get initials or first word for display
    const displayText = name.length > 15
        ? name.split(' ').map(w => w[0]?.toUpperCase()).join('').slice(0, 3)
        : name.slice(0, 15);

    // Pick a consistent color based on the name
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const backgroundColor = PASTEL_COLORS[nameHash % PASTEL_COLORS.length];

    // Size styles - use flex:1 if no explicit dimensions
    const sizeStyle = width && height
        ? { width, height }
        : { flex: 1 };

    return (
        <View style={[
            styles.container,
            { backgroundColor },
            sizeStyle,
            style
        ]}>
            <Text style={styles.text} numberOfLines={2}>
                {displayText}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    text: {
        color: PLACEHOLDER_TEXT,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 8,
    },
});
