import React, { useMemo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { radius, spacing, fontFamilies, shadows } from '@/constants/theme';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { useTheme } from '@/contexts/theme-context';
import { getProductImageUrl, PlaceholderImage } from '@/utils/image';
import { useWishlist, useToggleWishlist } from '@nuur-fashion-commerce/api';
import { useSession } from '@/lib/auth-client';

// Product type for component props
interface Product {
    id: string | number;
    name: string;
    price: number | string;
    image?: string;
    imageUrl?: string;
    images?: (string | { url: string })[];
    brand?: string | { name: string };
    isFavorite?: boolean;
}

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
    onFavoritePress?: () => void; // Optional - if provided, use it instead of internal handler
    style?: ViewStyle;
}

/**
 * ProductCard - matches the prototype design:
 * - 3:4 aspect ratio image with rounded corners
 * - Heart button top-right with wishlist API integration
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
    const router = useRouter();

    // Auth hook
    const session = useSession();
    const isLoggedIn = !!session.data?.user;

    // Wishlist hooks
    const { data: wishlistData } = useWishlist();
    const toggleWishlist = useToggleWishlist();
    const productId = String(product.id);
    // Handle both array and object with items property
    // Only check wishlist if user is logged in
    const wishlistItems = isLoggedIn && wishlistData
        ? (Array.isArray(wishlistData) ? wishlistData : wishlistData?.items || [])
        : [];
    const isWishlisted = wishlistItems.some((item: any) => item.productId === productId);

    // Handle wishlist toggle with auth check
    const handleWishlistToggle = () => {
        // If parent provides handler, use that instead
        if (onFavoritePress) {
            onFavoritePress();
            return;
        }

        if (!isLoggedIn) {
            Toast.show({
                type: 'info',
                text1: 'Sign In Required',
                text2: 'Please sign in to add items to your wishlist',
                position: 'top',
                onPress: () => {
                    Toast.hide();
                    router.push('/auth/login');
                },
            });
            return;
        }

        toggleWishlist.mutate(
            { productId, isCurrentlyWishlisted: isWishlisted },
            {
                onSuccess: () => {
                    Toast.show({
                        type: 'success',
                        text1: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
                        text2: isWishlisted
                            ? `${product.name} removed`
                            : `${product.name} added!`,
                        position: 'top',
                        visibilityTime: 2000,
                    });
                },
            }
        );
    };

    // Get image URL safely
    const imageUrl = getProductImageUrl(product);

    // Determine heart state - use API data if no parent handler, otherwise use product.isFavorite
    const showFilled = onFavoritePress ? product.isFavorite : isWishlisted;

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
                    onPress={handleWishlistToggle}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={showFilled ? 'heart' : 'heart-outline'}
                        size={18}
                        color={showFilled ? colors.primary : '#374151'}
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
