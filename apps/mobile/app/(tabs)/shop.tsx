import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useProducts, useCategories } from '@nuur-fashion-commerce/api';
import { ProductCard } from '@/components/ProductCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 2;
const GAP_SIZE = 16;
const CONTAINER_PADDING = 16;
const ITEM_WIDTH = (SCREEN_WIDTH - (CONTAINER_PADDING * 2) - GAP_SIZE) / COLUMN_COUNT;

export default function ShopScreen() {
    const router = useRouter();
    const { category: initialCategory } = useLocalSearchParams<{ category: string }>();
    const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
    const [searchQuery, setSearchQuery] = useState('');

    // API
    const { data: productsData, isLoading: productsLoading } = useProducts(
        activeCategory !== 'All' ? { category: activeCategory } : undefined
    );
    const { data: categoriesData } = useCategories();

    // Data Processing
    const products = useMemo(() => productsData?.products || productsData || [], [productsData]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(categoriesData?.map((c: any) => c.name) || [])) as string[];
        return ['All', ...unique];
    }, [categoriesData]);

    const filteredProducts = useMemo(() =>
        products.filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brand?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [products, searchQuery]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={{ width: ITEM_WIDTH, marginBottom: GAP_SIZE }}>
            <ProductCard
                id={item.id}
                name={item.name}
                brand={item.brand?.name || 'Unknown'}
                price={Number(item.price)}
                image={item.images?.[0]?.url || 'https://via.placeholder.com/300'}
                onPress={() => router.push(`/product/${item.id}` as any)}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Shop</Text>

                <View style={styles.searchRow}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search collection..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Categories */}
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryList}
                    contentContainerStyle={styles.categoryContent}
                    renderItem={({ item }) => {
                        const isActive = activeCategory === item;
                        return (
                            <TouchableOpacity
                                onPress={() => setActiveCategory(item as string)}
                                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                            >
                                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                    {item as string}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Product Grid */}
            <View style={styles.productContainer}>
                {productsLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredProducts}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.productGrid}
                        columnWrapperStyle={{ gap: GAP_SIZE }}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No products found</Text>
                            </View>
                        )}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    categoryList: {
        marginTop: 16,
    },
    categoryContent: {
        gap: 8,
    },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryPillActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    categoryTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
    productContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    productGrid: {
        paddingTop: 16,
        paddingBottom: 80,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        color: '#999',
        marginTop: 16,
    },
});
