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

interface Product {
    id: string | number;
    name: string;
    price: number | string;
    image?: string;
    imageUrl?: string;
    images?: (string | { url: string })[];
    brand?: string | { name: string };
    description?: string;
}

interface ProductListItemProps {
    product: Product;
    onPress?: () => void;
    style?: ViewStyle;
}

/**
 * ProductListItem - Horizontal list item for list view
 * - Image on left, details on right
 * - Compact layout for browsing more products
 */
export function ProductListItem({
    product,
    onPress,
    style,
}: ProductListItemProps) {
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
    const isWishlisted = wishlistData?.some((item: any) => item.productId === productId) || false;

    // Handle wishlist toggle with auth check
    const handleWishlistToggle = () => {
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

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Image */}
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
                        width={100}
                        height={100}
                        style={styles.image}
                    />
                )}
            </View>

            {/* Details */}
            <View style={styles.details}>
                {/* Brand */}
                {product.brand && (
                    <Text style={styles.brand}>
                        {typeof product.brand === 'string' ? product.brand : product.brand.name}
                    </Text>
                )}
                {/* Name */}
                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>
                {/* Description snippet */}
                {product.description && (
                    <Text style={styles.description} numberOfLines={1}>
                        {product.description}
                    </Text>
                )}
                {/* Price */}
                <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            </View>

            {/* Heart Button */}
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleWishlistToggle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name={isWishlisted ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isWishlisted ? colors.primary : colors.textSecondary}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.sm,
        ...shadows.sm,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.accent,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    details: {
        flex: 1,
        paddingHorizontal: spacing.md,
        justifyContent: 'center',
        gap: 2,
    },
    brand: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: colors.textSecondary,
    },
    name: {
        fontFamily: fontFamilies.display,
        fontSize: 14,
        color: colors.text,
        lineHeight: 18,
    },
    description: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    price: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: colors.primary,
        marginTop: spacing.xs,
    },
    favoriteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});
