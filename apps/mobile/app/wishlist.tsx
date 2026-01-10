import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { mockWishlist, Product } from '@/constants/mock-data';
import { palette, spacing, fontFamilies, shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

export default function WishlistScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={22} color={palette.text} />
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
                {mockWishlist.length > 0 ? (
                    <>
                        {/* Item Count */}
                        <Text style={styles.itemCount}>
                            {mockWishlist.length} {mockWishlist.length === 1 ? 'item' : 'items'}
                        </Text>

                        {/* Products Grid */}
                        <View style={styles.productsGrid}>
                            {mockWishlist.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{ ...product, isFavorite: true }}
                                    onPress={() => handleProductPress(product.id)}
                                    style={styles.productCard}
                                />
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="heart-outline" size={64} color={palette.textMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                        <Text style={styles.emptySubtitle}>
                            Save items you love by tapping the heart icon
                        </Text>
                        <Button
                            variant="primary"
                            size="md"
                            onPress={() => router.push('/(tabs)/shop')}
                            style={styles.startShoppingButton}
                        >
                            Start Shopping
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: palette.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: palette.text,
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

    // Item Count
    itemCount: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        marginBottom: spacing.lg,
    },

    // Products Grid - 2 column layout
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    productCard: {
        width: CARD_WIDTH,
        marginBottom: spacing.sm,
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.xxl * 2,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: palette.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 22,
        color: palette.text,
    },
    emptySubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        marginTop: spacing.sm,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    startShoppingButton: {
        marginTop: spacing.xl,
    },
});
