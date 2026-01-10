import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';
import {
  mockProducts,
  mockCategories,
  mockCartItems,
  getCartItemCount,
} from '@/constants/mock-data';
import { palette, spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cartCount = getCartItemCount(mockCartItems);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push('/(tabs)/shop');
  };

  return (
    <View style={styles.container}>
      {/* Header - matches prototype */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu" size={26} color={palette.text} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Nuur</Text>
          <Text style={styles.logoSubtitle}>FASHION</Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Ionicons name="bag-outline" size={24} color={palette.text} />
          {cartCount > 0 && (
            <View style={styles.cartBadge} />
          )}
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
              rightIcon={<Ionicons name="arrow-forward" size={18} color={palette.white} />}
              onPress={() => router.push('/(tabs)/shop')}
            >
              Shop Now
            </Button>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesRow}>
            {mockCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={{ uri: category.image }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.categoryLabel}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Now Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product.id)}
                style={styles.productCard}
              />
            ))}
          </View>
        </View>

        {/* New In Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New In</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {mockProducts.slice(4, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product.id)}
                style={styles.productCard}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },

  // Header - matching prototype
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: palette.background,
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
    color: palette.text,
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 8,
    letterSpacing: 3,
    color: palette.textSecondary,
    marginTop: -2,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
    borderWidth: 1,
    borderColor: palette.background,
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
    color: palette.white,
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
    color: palette.text,
  },
  seeAllText: {
    fontSize: 12,
    color: palette.textSecondary,
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
    borderColor: palette.border,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontSize: 12,
    color: palette.textSecondary,
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
});
