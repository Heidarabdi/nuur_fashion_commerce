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
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/ProductCard';
import { ProductListItem } from '@/components/ProductListItem';
import { CategoryPill } from '@/components/ui';
import { useProducts, useCategories, useBrands } from '@nuur-fashion-commerce/api';
import { spacing, fontFamilies, radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

const { width, height } = Dimensions.get('window');
// 2-column grid: (screenWidth - leftPadding - rightPadding - gapBetween) / 2
const CARD_WIDTH = (width - spacing.sm * 2 - spacing.sm) / 2;

export default function ShopScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // API hooks
    const { data: categoriesData } = useCategories();
    const { data: brandsData } = useBrands();
    const categories = categoriesData || [];
    const brands = brandsData || [];

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategories, setShowCategories] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState<string>('newest');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Build filters for API query
    const filters = useMemo(() => ({
        categoryId: selectedCategory || undefined,
        brandId: selectedBrand || undefined,
        search: searchQuery.trim() || undefined,
        sortBy: selectedSort as any,
    }), [selectedCategory, selectedBrand, searchQuery, selectedSort]);

    // Fetch products with filters
    const { data: products, isLoading: productsLoading } = useProducts(filters);

    // Filter products based on search and price
    const allProducts = products || [];
    const filteredProducts = allProducts.filter((p: any) => {
        // Search filter
        if (searchQuery.trim()) {
            const searchLower = searchQuery.toLowerCase();
            const nameMatch = p.name?.toLowerCase().includes(searchLower);
            const brandName = typeof p.brand === 'string' ? p.brand : (p.brand?.name || '');
            const brandMatch = brandName.toLowerCase().includes(searchLower);
            if (!nameMatch && !brandMatch) return false;
        }

        // Price filter
        const productPrice = parseFloat(p.price) || 0;
        if (minPrice && productPrice < parseFloat(minPrice)) return false;
        if (maxPrice && productPrice > parseFloat(maxPrice)) return false;

        return true;
    });

    const resultCount = filteredProducts.length;

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setShowCategories(text.length === 0);
    };

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
        { label: 'Name A-Z', value: 'name-asc' },
    ];

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
                    <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={{ marginRight: spacing.sm }}>
                        <Ionicons name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'} size={22} color={colors.textMuted} />
                    </TouchableOpacity>
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
                        {categories.length === 0 ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoriesContent}
                            >
                                {(categories || []).map((category: any) => (
                                    <CategoryPill
                                        key={category.id}
                                        label={category.name}
                                        onPress={() => {
                                            setSearchQuery(category.name);
                                            setShowCategories(false);
                                        }}
                                    />
                                ))}
                            </ScrollView>
                        )}
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

                {/* Products Grid/List */}
                {productsLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ paddingVertical: spacing.xxl }} />
                ) : viewMode === 'grid' ? (
                    <View style={styles.productsGrid}>
                        {filteredProducts.map((product: any) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onPress={() => handleProductPress(product.id)}
                                style={styles.productCard}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.productsList}>
                        {filteredProducts.map((product: any) => (
                            <ProductListItem
                                key={product.id}
                                product={product}
                                onPress={() => handleProductPress(product.id)}
                                style={styles.productListItem}
                            />
                        ))}
                    </View>
                )}

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
                            setSelectedSort('newest');
                            setSelectedCategory(null);
                            setSelectedBrand(null);
                            setMinPrice('');
                            setMaxPrice('');
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
                        {/* Price Range */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>PRICE RANGE</Text>
                            <View style={styles.priceRangeRow}>
                                <View style={styles.priceInputContainer}>
                                    <Text style={styles.priceLabel}>Min $</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="0"
                                        placeholderTextColor={colors.textMuted}
                                        value={minPrice}
                                        onChangeText={setMinPrice}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text style={styles.priceSeparator}>—</Text>
                                <View style={styles.priceInputContainer}>
                                    <Text style={styles.priceLabel}>Max $</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="500"
                                        placeholderTextColor={colors.textMuted}
                                        value={maxPrice}
                                        onChangeText={setMaxPrice}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Sort By */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>SORT BY</Text>
                            <View style={styles.sortOptions}>
                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.sortOption}
                                        onPress={() => setSelectedSort(option.value)}
                                    >
                                        <Text style={[
                                            styles.sortOptionText,
                                            selectedSort === option.value && styles.sortOptionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {selectedSort === option.value && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Category Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>CATEGORY</Text>
                            <View style={styles.sortOptions}>
                                <TouchableOpacity
                                    style={styles.sortOption}
                                    onPress={() => setSelectedCategory(null)}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        !selectedCategory && styles.sortOptionTextActive
                                    ]}>
                                        All Categories
                                    </Text>
                                    {!selectedCategory && (
                                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                                {categories.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={styles.sortOption}
                                        onPress={() => setSelectedCategory(cat.id)}
                                    >
                                        <Text style={[
                                            styles.sortOptionText,
                                            selectedCategory === cat.id && styles.sortOptionTextActive
                                        ]}>
                                            {cat.name}
                                        </Text>
                                        {selectedCategory === cat.id && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Brand Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>BRAND</Text>
                            <View style={styles.sortOptions}>
                                <TouchableOpacity
                                    style={styles.sortOption}
                                    onPress={() => setSelectedBrand(null)}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        !selectedBrand && styles.sortOptionTextActive
                                    ]}>
                                        All Brands
                                    </Text>
                                    {!selectedBrand && (
                                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                                {brands.map((brand: any) => (
                                    <TouchableOpacity
                                        key={brand.id}
                                        style={styles.sortOption}
                                        onPress={() => setSelectedBrand(brand.id)}
                                    >
                                        <Text style={[
                                            styles.sortOptionText,
                                            selectedBrand === brand.id && styles.sortOptionTextActive
                                        ]}>
                                            {brand.name}
                                        </Text>
                                        {selectedBrand === brand.id && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
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
        paddingHorizontal: spacing.sm,
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
        gap: spacing.sm,
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
    priceRangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    priceInputContainer: {
        flex: 1,
    },
    priceLabel: {
        fontFamily: fontFamilies.sans,
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    priceInput: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
    },
    priceSeparator: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 16,
        color: colors.textMuted,
        paddingTop: spacing.lg,
    },
    productsList: {
        gap: spacing.sm,
        paddingTop: spacing.md,
    },
    productListItem: {
        width: '100%',
    },
});
