import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Modal,
    Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/ProductCard';
import { CategoryPill } from '@/components/ui';
import { mockProducts, mockCategories } from '@/constants/mock-data';
import { spacing, fontFamilies, radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

export default function ShopScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showCategories, setShowCategories] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);

    // Filter states
    const [selectedSort, setSelectedSort] = useState('Recommended');
    const [selectedSize, setSelectedSize] = useState<string | null>('M');
    const [selectedColor, setSelectedColor] = useState<string | null>('#BC6C4D');

    const filteredProducts = searchQuery.trim()
        ? mockProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : mockProducts;

    const resultCount = filteredProducts.length;

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setShowCategories(text.length === 0);
    };

    const sortOptions = ['Recommended', 'Newest Arrivals', 'Price: Low to High', 'Price: High to Low'];
    const sizes = ['S', 'M', 'L', 'XL'];
    const colorOptions = ['#BC6C4D', '#E8E1D5', '#1F1F1F', '#FFFFFF', '#2A3B4C'];

    return (
        <View style={styles.container}>
            {/* Sticky Search Header */}
            <View style={[styles.searchHeader, { paddingTop: insets.top + spacing.md }]}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={22} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for styles, brands..."
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity onPress={() => setFilterVisible(true)}>
                        <Ionicons name="options-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 120 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Categories - show when no search */}
                {showCategories && (
                    <View style={styles.categoriesSection}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesContent}
                        >
                            {mockCategories.map((category) => (
                                <CategoryPill
                                    key={category.id}
                                    category={category}
                                    onPress={() => {
                                        setSearchQuery(category.name);
                                        setShowCategories(false);
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Results Count */}
                {searchQuery.trim() && (
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsCount}>
                            {resultCount} Results for <Text style={styles.searchTerm}>{searchQuery}</Text>
                        </Text>
                    </View>
                )}

                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onPress={() => handleProductPress(product.id)}
                            style={styles.productCard}
                        />
                    ))}
                </View>

                {filteredProducts.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyTitle}>No products found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try a different search term
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Filter Bottom Sheet Modal */}
            <Modal
                visible={filterVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setFilterVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setFilterVisible(false)}
                />
                <View style={styles.filterSheet}>
                    {/* Drag Indicator */}
                    <View style={styles.dragIndicatorContainer}>
                        <View style={styles.dragIndicator} />
                    </View>

                    {/* Header */}
                    <View style={styles.filterHeader}>
                        <TouchableOpacity onPress={() => {
                            setSelectedSort('Recommended');
                            setSelectedSize('M');
                            setSelectedColor('#BC6C4D');
                        }}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                        <Text style={styles.filterTitle}>Filter</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setFilterVisible(false)}
                        >
                            <Ionicons name="close" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
                        {/* Sort By */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>SORT BY</Text>
                            <View style={styles.sortOptions}>
                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={styles.sortOption}
                                        onPress={() => setSelectedSort(option)}
                                    >
                                        <Text style={[
                                            styles.sortOptionText,
                                            selectedSort === option && styles.sortOptionTextActive
                                        ]}>
                                            {option}
                                        </Text>
                                        {selectedSort === option && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Size */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>SIZE</Text>
                            <View style={styles.sizeOptions}>
                                {sizes.map((size) => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[
                                            styles.sizeButton,
                                            selectedSize === size && styles.sizeButtonActive
                                        ]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <Text style={[
                                            styles.sizeButtonText,
                                            selectedSize === size && styles.sizeButtonTextActive
                                        ]}>
                                            {size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Color */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>COLOR</Text>
                            <View style={styles.colorOptions}>
                                {colorOptions.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorButton,
                                            { backgroundColor: color },
                                            color === '#FFFFFF' && styles.colorButtonWhite,
                                            selectedColor === color && styles.colorButtonActive
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Apply Button */}
                    <View style={[styles.applyContainer, { paddingBottom: insets.bottom + spacing.md }]}>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setFilterVisible(false)}
                        >
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Search Header
    searchHeader: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        paddingHorizontal: spacing.md,
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    searchInput: {
        flex: 1,
        fontFamily: fontFamilies.sans,
        fontSize: 15,
        color: colors.text,
        marginLeft: spacing.sm,
        paddingVertical: 0,
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
    },

    // Categories
    categoriesSection: {
        marginVertical: spacing.md,
    },
    categoriesContent: {
        gap: spacing.md,
        paddingHorizontal: spacing.xs,
    },

    // Results
    resultsHeader: {
        paddingVertical: spacing.sm,
    },
    resultsCount: {
        fontFamily: fontFamilies.sans,
        fontSize: 16,
        color: colors.text,
        fontWeight: '300',
    },
    searchTerm: {
        fontFamily: fontFamilies.sansMedium,
        fontWeight: '500',
    },

    // Products Grid - 2 column layout
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        paddingTop: spacing.md,
    },
    productCard: {
        width: CARD_WIDTH,
        marginBottom: spacing.sm,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxl * 2,
    },
    emptyTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 20,
        color: colors.text,
        marginTop: spacing.lg,
    },
    emptySubtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },

    // Floating Sort/Filter Bar
    floatingBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
    floatingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.text,
        borderRadius: radius.full,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        ...shadows.lg,
    },
    floatingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    floatingButtonText: {
        fontFamily: fontFamilies.sansBold,
        fontSize: 14,
        color: colors.white,
        letterSpacing: 0.3,
    },
    floatingDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: spacing.sm,
    },

    // Modal Overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    // Filter Sheet
    filterSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.85,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        ...shadows.lg,
    },
    dragIndicatorContainer: {
        alignItems: 'center',
        paddingTop: spacing.sm,
    },
    dragIndicator: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.border,
        opacity: 0.6,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    resetText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
    },
    filterTitle: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: colors.text,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    filterSection: {
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    filterSectionTitle: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 11,
        color: colors.text,
        letterSpacing: 1.5,
        marginBottom: spacing.lg,
    },
    sortOptions: {
        gap: spacing.md,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sortOptionText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 15,
        color: colors.textSecondary,
    },
    sortOptionTextActive: {
        color: colors.primary,
    },
    sizeOptions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    sizeButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sizeButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    sizeButtonText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
    },
    sizeButtonTextActive: {
        color: colors.white,
    },
    colorOptions: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    colorButtonWhite: {
        borderWidth: 1,
        borderColor: colors.border,
    },
    colorButtonActive: {
        borderWidth: 2,
        borderColor: colors.primary,
        transform: [{ scale: 1.1 }],
    },
    applyContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    applyButton: {
        backgroundColor: colors.text,
        paddingVertical: spacing.md + 2,
        borderRadius: radius.xl,
        alignItems: 'center',
        ...shadows.lg,
    },
    applyButtonText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: colors.white,
    },
});
