import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';
import { useProducts, useCategories } from '@nuur-fashion-commerce/api';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // API hooks - replace mock data with real data
  const { data: products, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();


  // Memoize styles - only regenerate when colors change
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push('/(tabs)/shop');
  };

  // Split products for different sections
  const trendingProducts = products?.slice(0, 4) || [];
  const newProducts = products?.slice(4, 8) || [];

  return (
    <View style={styles.container}>
      {/* Header - matches prototype */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {/* Spacer for balance */}
        <View style={styles.headerButton} />

        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Nuur</Text>
          <Text style={styles.logoSubtitle}>FASHION</Text>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>New Arrivals</Text>
            <Button
              variant="primary"
              size="md"
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.white} />}
              onPress={() => router.push('/(tabs)/shop')}
            >
              Shop Now
            </Button>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          {categoriesLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.categoriesRow}>
              {(categories || []).slice(0, 4).map((category: any) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress(category.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryImageContainer}>
                    <Image
                      source={{ uri: category.imageUrl || category.image || 'https://via.placeholder.com/64' }}
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Trending Now Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {productsLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : productsError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
              <Text style={styles.errorText}>Unable to load products</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {trendingProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product.id)}
                  style={styles.productCard}
                />
              ))}
            </View>
          )}
        </View>

        {/* New In Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New In</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {!productsLoading && !productsError && (
            <View style={styles.productsGrid}>
              {newProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product.id)}
                  style={styles.productCard}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Style Factory - generates styles based on theme colors
const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header - matching prototype
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Playfair_700Bold',
    fontSize: 24,
    color: colors.text,
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 8,
    letterSpacing: 3,
    color: colors.textSecondary,
    marginTop: -2,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.background,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  // Hero Banner
  heroBanner: {
    height: 420,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: 'Playfair_700Bold',
    fontSize: 40,
    color: colors.white,
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Playfair_700Bold',
    fontSize: 20,
    color: colors.text,
  },
  seeAllText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Categories - matching prototype circles
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
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

  // Loading & Error states
  loader: {
    paddingVertical: spacing.xl,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
