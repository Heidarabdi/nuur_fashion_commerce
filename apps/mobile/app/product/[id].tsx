import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { Button } from '@/components/ui';
import { useProduct, useAddToCart } from '@nuur-fashion-commerce/api';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { spacing, fontFamilies, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { getProductImageUrl, PlaceholderImage } from '@/utils/image';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Bottom sheet snap points
const COLLAPSED_HEIGHT = 200; // Shows title, price, rating, and button
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.70; // Full details with variants
const MAX_TRANSLATE_Y = -EXPANDED_HEIGHT + COLLAPSED_HEIGHT;

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // API hooks
    const { data: product, isLoading } = useProduct(id || '');
    const addToCart = useAddToCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Set initial color when product loads
    React.useEffect(() => {
        if (product?.colors?.[0] && !selectedColor) {
            setSelectedColor(product.colors[0]);
        }
    }, [product, selectedColor]);

    const sizes = product?.sizes || ['S', 'M', 'L', 'XL'];
    const productColors = product?.colors || ['#BC6C4D'];

    // Animation values
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    // Gesture handler for dragging
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = Math.max(
                Math.min(context.value.y + event.translationY, 0),
                MAX_TRANSLATE_Y
            );
        })
        .onEnd((event) => {
            if (event.velocityY < -500) {
                translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 25, stiffness: 150 });
            } else if (event.velocityY > 500) {
                translateY.value = withSpring(0, { damping: 25, stiffness: 150 });
            } else {
                const snapPoint = translateY.value < MAX_TRANSLATE_Y / 2 ? MAX_TRANSLATE_Y : 0;
                translateY.value = withSpring(snapPoint, { damping: 25, stiffness: 150 });
            }
        });

    // Animated styles for sheet
    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Show loading state
    if (isLoading) {
        return (
            <GestureHandlerRootView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </GestureHandlerRootView>
        );
    }

    // If no product found
    if (!product) {
        return (
            <GestureHandlerRootView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
                    <Text style={{ color: colors.textSecondary, marginTop: spacing.md }}>Product not found</Text>
                </View>
            </GestureHandlerRootView>
        );
    }

    // Get image URL using centralized utility
    const imageUrl = getProductImageUrl(product);

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Full Screen Product Image */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ) : (
                    <PlaceholderImage
                        name={product.name}
                        style={styles.productImage}
                    />
                )}

                {/* Floating Header Buttons */}
                <View style={[styles.floatingHeader, { top: insets.top + spacing.sm }]}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="share-outline" size={22} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => setIsFavorite(!isFavorite)}
                        >
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={22}
                                color={isFavorite ? colors.primary : colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bottom Sheet with Gesture */}
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { height: EXPANDED_HEIGHT, paddingBottom: insets.bottom },
                        sheetStyle
                    ]}
                >
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {/* Title, Price, Rating - Always visible */}
                    <View style={styles.headerContent}>
                        <View style={styles.titleRow}>
                            <View style={styles.titleInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.price}>{formatCurrency(product.price)}</Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={16} color="#FFB800" />
                                <Text style={styles.ratingText}>4.8</Text>
                            </View>
                        </View>
                    </View>

                    {/* Expandable Content: Variants - shown when swiped up */}
                    <ScrollView
                        style={styles.expandedContent}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Description */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>
                                {product.description || 'No description available.'}
                            </Text>
                        </View>

                        {/* Size Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Size</Text>
                            <View style={styles.optionsRow}>
                                {sizes.map((size: string) => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[
                                            styles.sizeButton,
                                            selectedSize === size && styles.sizeButtonSelected,
                                        ]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <Text
                                            style={[
                                                styles.sizeText,
                                                selectedSize === size && styles.sizeTextSelected,
                                            ]}
                                        >
                                            {size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Color Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Color</Text>
                            <View style={styles.optionsRow}>
                                {productColors.map((color: string) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorButton,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.colorButtonSelected,
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Add to Cart Button - Fixed at bottom of drawer */}
                    <View style={styles.addToCartContainer}>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isAddingToCart}
                            onPress={async () => {
                                if (!product) return;
                                setIsAddingToCart(true);
                                try {
                                    await addToCart.mutateAsync({
                                        productId: product.id,
                                        quantity: 1,
                                    });
                                    // Navigate to cart after successful add
                                    router.push('/(tabs)/cart');
                                } catch (error) {
                                    console.error('Failed to add to cart:', error);
                                } finally {
                                    setIsAddingToCart(false);
                                }
                            }}
                            style={styles.addToCartButton}
                        >
                            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                        </Button>
                    </View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Full-screen Image
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },

    // Floating Header
    floatingHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    headerRight: {
        flexDirection: 'row',
        gap: spacing.sm,
    },

    // Bottom Sheet
    bottomSheet: {
        position: 'absolute',
        bottom: -EXPANDED_HEIGHT + COLLAPSED_HEIGHT,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },

    // Drag Handle
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: spacing.sm,
        paddingBottom: spacing.xs,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
    },

    // Header Content (always visible in collapsed state)
    headerContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleInfo: {
        flex: 1,
        marginRight: spacing.md,
    },
    productName: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 22,
        color: colors.text,
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    price: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: colors.primary,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 16,
    },
    ratingText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 15,
        color: colors.text,
    },

    // Expanded Content
    expandedContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    scrollContent: {
        paddingBottom: spacing.md,
    },

    // Sections
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    description: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },

    // Options Row
    optionsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },

    // Sizes
    sizeButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sizeButtonSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    sizeText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
    },
    sizeTextSelected: {
        color: colors.white,
    },

    // Colors
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorButtonSelected: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    // Add to Cart - at bottom of drawer
    addToCartContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: colors.surface,
    },
    addToCartButton: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
});
