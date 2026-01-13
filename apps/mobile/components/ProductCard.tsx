import React, { useMemo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, fontFamilies, shadows } from '@/constants/theme';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { useTheme } from '@/contexts/theme-context';
import { getProductImageUrl, PlaceholderImage } from '@/utils/image';

// Product type for component props
interface Product {
    id: string | number;
    name: string;
    price: number | string;
    image?: string;
    imageUrl?: string;
    images?: Array<string | { url: string }>;
    brand?: string | { name: string };
    isFavorite?: boolean;
}

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
    onFavoritePress?: () => void;
    style?: ViewStyle;
}

/**
 * ProductCard - matches the prototype design:
 * - 3:4 aspect ratio image with rounded corners
 * - Heart button top-right (shows on hover in web)
 * - Brand name in uppercase small text
 * - Product name in Playfair Display font
 * - Price in primary color
 */
export function ProductCard({
    product,
    onPress,
    onFavoritePress,
    style,
}: ProductCardProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Get image URL safely
    const imageUrl = getProductImageUrl(product);

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Image Container */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <PlaceholderImage
                        name={product.name}
                        width={undefined}
                        height={undefined}
                        style={styles.image}
                    />
                )}
                {/* Heart Button - positioned top right */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={onFavoritePress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={product.isFavorite ? 'heart' : 'heart-outline'}
                        size={18}
                        color={product.isFavorite ? colors.primary : colors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Product Details - following prototype layout */}
            <View style={styles.details}>
                {/* Brand Name - uppercase, small, muted */}
                {product.brand && <Text style={styles.brand}>{typeof product.brand === 'string' ? product.brand : product.brand.name}</Text>}
                {/* Product Name - Playfair Display, bold */}
                <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                </Text>
                {/* Price - primary color */}
                <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        // Width controlled by parent via style prop
    },
    // Image: 3:4 aspect ratio with rounded corners
    imageContainer: {
        position: 'relative',
        aspectRatio: 3 / 4,
        borderRadius: radius.xl,
        overflow: 'hidden',
        backgroundColor: colors.accent,
        marginBottom: spacing.sm,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    // Heart button: top-right, rounded, translucent background
    favoriteButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    // Details container with proper gap
    details: {
        gap: 4,
    },
    // Brand: uppercase, very small, tracking
    brand: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: colors.textSecondary,
    },
    // Name: Playfair Display, semibold
    name: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 14,
        color: colors.text,
        lineHeight: 18,
    },
    // Price: medium weight, primary color
    price: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.primary,
        marginTop: 2,
    },
});
