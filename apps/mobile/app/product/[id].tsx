import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui';
import { mockProducts, formatPrice } from '@/constants/mock-data';
import { palette, spacing, fontFamilies, shadows } from '@/constants/theme';

const { height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.65;

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const product = mockProducts.find((p) => p.id === id) || mockProducts[0];
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [isFavorite, setIsFavorite] = useState(product.isFavorite);

    const sizes = product.sizes;
    const colors = product.colors;

    return (
        <View style={styles.container}>
            {/* Full Height Product Image - 65% of screen */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                {/* Floating Header Buttons - over image */}
                <View style={[styles.floatingHeader, { top: insets.top + spacing.sm }]}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color={palette.text} />
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="share-outline" size={22} color={palette.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => setIsFavorite(!isFavorite)}
                        >
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={22}
                                color={isFavorite ? palette.primary : palette.text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bottom Sheet Drawer - overlaps image */}
            <View style={styles.bottomSheet}>
                {/* Drag Indicator */}
                <View style={styles.dragIndicatorContainer}>
                    <View style={styles.dragIndicator} />
                </View>

                <ScrollView
                    style={styles.bottomSheetContent}
                    contentContainerStyle={styles.bottomSheetScrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title and Price Row */}
                    <View style={styles.titleRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                    </View>

                    <View style={styles.priceRatingRow}>
                        <Text style={styles.price}>{formatPrice(product.price)}</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name="star"
                                    size={14}
                                    color="#FFB800"
                                />
                            ))}
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description} numberOfLines={2}>
                            {product.description}
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.readMore}>
                                Read more <Ionicons name="chevron-down" size={12} color={palette.primary} />
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Size Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Size</Text>
                        <View style={styles.sizeRow}>
                            {sizes.map((size) => (
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
                        <View style={styles.colorRow}>
                            {colors.map((color) => (
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

                {/* Add to Cart Button - Fixed at bottom */}
                <View style={[styles.addToCartContainer, { paddingBottom: insets.bottom + spacing.md }]}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/(tabs)/cart')}
                        style={styles.addToCartButton}
                    >
                        Add to Cart
                    </Button>
                </View>

                {/* Home Indicator */}
                <View style={styles.homeIndicatorContainer}>
                    <View style={styles.homeIndicator} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },

    // Full-height Image
    imageContainer: {
        height: IMAGE_HEIGHT,
        width: '100%',
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.55,
        backgroundColor: palette.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        ...shadows.lg,
    },
    dragIndicatorContainer: {
        alignItems: 'center',
        paddingTop: spacing.sm,
        paddingBottom: spacing.xs,
    },
    dragIndicator: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: palette.border,
    },
    bottomSheetContent: {
        flex: 1,
    },
    bottomSheetScrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },

    // Title & Price
    titleRow: {
        marginBottom: spacing.xs,
    },
    productName: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 22,
        color: palette.text,
        letterSpacing: -0.3,
    },
    priceRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    price: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 18,
        color: palette.text,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },

    // Section
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 14,
        color: palette.text,
        marginBottom: spacing.sm,
    },
    description: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: palette.textSecondary,
        lineHeight: 20,
    },
    readMore: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: palette.primary,
        marginTop: spacing.xs,
    },

    // Sizes
    sizeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    sizeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: palette.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sizeButtonSelected: {
        backgroundColor: palette.primary,
        borderColor: palette.primary,
    },
    sizeText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: palette.textSecondary,
    },
    sizeTextSelected: {
        color: palette.white,
    },

    // Colors
    colorRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    colorButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.border,
    },
    colorButtonSelected: {
        borderWidth: 2,
        borderColor: palette.primary,
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },

    // Add to Cart
    addToCartContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: palette.surface,
    },
    addToCartButton: {
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },

    // Home Indicator
    homeIndicatorContainer: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
        backgroundColor: palette.surface,
    },
    homeIndicator: {
        width: 120,
        height: 4,
        borderRadius: 2,
        backgroundColor: palette.text,
    },
});
