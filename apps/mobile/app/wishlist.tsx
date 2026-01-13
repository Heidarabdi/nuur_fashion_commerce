import React, { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { useWishlist, useRemoveFromWishlist, useAddToCart } from '@nuur-fashion-commerce/api';
import { spacing, fontFamilies, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

export default function WishlistScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // API hooks
    const { data: wishlistData, isLoading } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const addToCart = useAddToCart();

    // Extract wishlist items - API might return items or products array
    const wishlistItems = wishlistData?.items || wishlistData || [];

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const handleRemoveFromWishlist = (productId: string) => {
        removeFromWishlist.mutate(productId);
    };

    const handleMoveToCart = async (productId: string) => {
        try {
            await addToCart.mutateAsync({
                productId,
                quantity: 1,
            });
            // Remove from wishlist after adding to cart
            removeFromWishlist.mutate(productId);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>My Wishlist</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>My Wishlist</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + spacing.xl },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {wishlistItems.length > 0 ? (
                    <>
                        {/* Item Count */}
                        <Text style={styles.itemCount}>
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                        </Text>

                        {/* Products Grid */}
                        <View style={styles.productsGrid}>
                            {wishlistItems.map((item: any) => {
                                const product = item.product || item;
                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onPress={() => handleProductPress(product.id)}
                                        onFavoritePress={() => handleRemoveFromWishlist(product.id)}
                                        style={styles.productCard}
                                    />
                                );
                            })}
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                        <Text style={styles.emptySubtitle}>
                            Save your favorite items here for easy access
                        </Text>
                        <Button
                            variant="primary"
                            size="lg"
                            onPress={() => router.push('/(tabs)/shop')}
                            style={styles.browseButton}
                        >
                            Browse Products
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    title: {
        flex: 1,
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: colors.text,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },
    itemCount: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    productCard: {
        width: CARD_WIDTH,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl * 2,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 24,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: 280,
        marginBottom: spacing.xl,
    },
    browseButton: {
        minWidth: 200,
    },
});
