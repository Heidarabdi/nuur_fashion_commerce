import { Image, StyleSheet, Platform, ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ProductCard } from '@/components/ProductCard';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock Data
const CATEGORIES = [
  { id: '1', name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', name: 'Men', image: 'https://images.unsplash.com/photo-1488161628813-99c974c79123?q=80&w=1964&auto=format&fit=crop' },
  { id: '3', name: 'Accessories', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1965&auto=format&fit=crop' },
  { id: '4', name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop' },
];

const TRENDING = [
  { id: '1', name: 'Silk Slip Dress', brand: 'STUDIO NICHOLSON', price: 120.00, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop' },
  { id: '2', name: 'Structured Wool Blazer', brand: 'APEX TAILORS', price: 250.00, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop' },
  { id: '3', name: 'Wide-Leg Trousers', brand: 'AURA BASICS', price: 95.00, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888&auto=format&fit=crop' },
  { id: '4', name: 'Cotton Shacket', brand: 'NOMAD APPAREL', price: 110.00, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2005&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <IconSymbol name="line.3.horizontal" size={24} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 40, height: 40, resizeMode: 'contain' }} // Placeholder for Logo
        />
        <TouchableOpacity>
          <IconSymbol name="bag" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>New Arrivals</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={styles.heroButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/(tabs)/shop?category=${cat.name}` as any)}>
                <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <View style={styles.productGrid}>
            {TRENDING.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard
                  {...product}
                  onPress={() => router.push(`/product/${product.id}` as any)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  hero: {
    height: 400,
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  heroButton: {
    backgroundColor: '#fff', // White button based on design
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 4,
  },
  heroButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#000',
  },
  categoryList: {
    paddingHorizontal: 15,
    gap: 15,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gridItem: {
    width: '50%',
  },
});
