/**
 * Mock Data for Nuur Fashion App
 * Used for development and testing
 */

// =============================================================================
// TYPES
// =============================================================================

export interface Product {
    id: string;
    name: string;
    brand?: string;
    price: number;
    image: string;
    imageUrl?: string;  // API uses imageUrl
    category?: string;
    colors?: string[];
    sizes?: string[];
    description?: string;
    isFavorite?: boolean;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
}

export interface OrderItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    trackingNumber?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    ordersCount: number;
    wishlistCount: number;
    points: number;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'order' | 'promo' | 'system';
    read: boolean;
    date: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

export const mockCategories: Category[] = [
    {
        id: '1',
        name: 'Women',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200',
    },
    {
        id: '2',
        name: 'Men',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
        id: '3',
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    },
    {
        id: '4',
        name: 'Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
    },
];

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'The Essential Trench',
        brand: 'Nuur Studio',
        price: 295,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
        category: 'Women',
        colors: ['#D2B48C', '#000000', '#556B2F'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'A timeless classic, our Essential Trench coat is crafted from premium cotton with a water-resistant finish. Features a belted waist, storm flap, and deep pockets.',
        isFavorite: true,
    },
    {
        id: '2',
        name: "Women's Tv Spirit",
        brand: 'Brand Name',
        price: 350,
        image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400',
        category: 'Women',
        colors: ['#000000', '#8B4513', '#2F4F4F'],
        sizes: ['S', 'M', 'L'],
        description: 'Elevate your style with this sophisticated piece. Made from luxurious fabric with exceptional attention to detail.',
    },
    {
        id: '3',
        name: 'Coll la Brisbed',
        brand: 'Archive',
        price: 480,
        image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400',
        category: 'Women',
        colors: ['#F5F5DC', '#8B4513'],
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'From our Archive collection, this piece combines vintage elegance with modern comfort.',
    },
    {
        id: '4',
        name: 'Classic Trench',
        brand: 'Archive',
        price: 520,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
        category: 'Women',
        colors: ['#D2B48C', '#000000'],
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Our signature Classic Trench, reimagined for the modern wardrobe. Premium materials meet timeless design.',
    },
    {
        id: '5',
        name: 'Luxe Knit Set',
        brand: 'Studio',
        price: 295,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
        category: 'Women',
        colors: ['#F5F5DC', '#808080', '#000000'],
        sizes: ['S', 'M', 'L'],
        description: 'Comfort meets luxury in this cashmere-blend knit set. Perfect for lounging or elevated casual wear.',
    },
    {
        id: '6',
        name: 'Leather Clutch',
        brand: 'Accessories',
        price: 145,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        category: 'Accessories',
        colors: ['#BC6C4D', '#000000', '#8B4513'],
        sizes: ['One Size'],
        description: 'Handcrafted leather clutch with secure magnetic closure. Features interior card slots and phone pocket.',
    },
    {
        id: '7',
        name: 'Minimal Sneakers',
        brand: 'Footwear',
        price: 185,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        category: 'Shoes',
        colors: ['#FFFFFF', '#000000'],
        sizes: ['36', '37', '38', '39', '40', '41', '42'],
        description: 'Clean, minimal sneakers crafted from premium leather. Cushioned insole for all-day comfort.',
    },
    {
        id: '8',
        name: 'Wool Blazer',
        brand: 'Men',
        price: 425,
        image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400',
        category: 'Men',
        colors: ['#2F4F4F', '#000000', '#808080'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Tailored wool blazer with a contemporary fit. Perfect for business or smart-casual occasions.',
    },
];

export const mockCartItems: CartItem[] = [
    {
        id: 'cart-1',
        product: mockProducts[0],
        quantity: 1,
        selectedColor: '#D2B48C',
        selectedSize: 'M',
    },
    {
        id: 'cart-2',
        product: mockProducts[1],
        quantity: 2,
        selectedColor: '#000000',
        selectedSize: 'S',
    },
    {
        id: 'cart-3',
        product: mockProducts[5],
        quantity: 1,
        selectedColor: '#BC6C4D',
        selectedSize: 'One Size',
    },
];

export const mockUser: User = {
    id: '1',
    name: 'Elena Nuur',
    email: 'elena.nuur@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    ordersCount: 12,
    wishlistCount: 48,
    points: 2400,
};

export const mockOrders: Order[] = [
    {
        id: '8821',
        items: [
            { id: '1', name: 'Beige Trench Coat', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200', price: 295, quantity: 1 },
            { id: '2', name: 'Leather Belt', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', price: 155, quantity: 1 },
        ],
        total: 450,
        status: 'delivered',
        date: '2023-10-24',
        trackingNumber: 'TRK123456789',
    },
    {
        id: '8820',
        items: [
            { id: '3', name: 'Leather Boots', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200', price: 210, quantity: 1 },
        ],
        total: 210,
        status: 'processing',
        date: '2023-10-12',
    },
    {
        id: '8819',
        items: [
            { id: '4', name: 'Silk Scarf', image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=200', price: 85, quantity: 1 },
        ],
        total: 85,
        status: 'delivered',
        date: '2023-09-05',
        trackingNumber: 'TRK567890123',
    },
    {
        id: '8815',
        items: [
            { id: '5', name: 'Handbag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', price: 320, quantity: 1 },
        ],
        total: 320,
        status: 'delivered',
        date: '2023-08-18',
        trackingNumber: 'TRK112233445',
    },
];

export const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Order Shipped!',
        message: 'Your order ORD-002 has been shipped and is on its way.',
        type: 'order',
        read: false,
        date: '2024-01-09',
    },
    {
        id: '2',
        title: 'Flash Sale 🔥',
        message: 'Enjoy 30% off on all accessories this weekend!',
        type: 'promo',
        read: false,
        date: '2024-01-08',
    },
    {
        id: '3',
        title: 'Welcome to Nuur!',
        message: 'Thanks for joining. Enjoy 15% off your first order with code WELCOME15.',
        type: 'promo',
        read: true,
        date: '2024-01-01',
    },
    {
        id: '4',
        title: 'Order Delivered',
        message: 'Your order ORD-001 has been delivered successfully.',
        type: 'order',
        read: true,
        date: '2024-01-07',
    },
];

export const mockWishlist: Product[] = [
    mockProducts[0],
    mockProducts[2],
    mockProducts[4],
    mockProducts[6],
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getCartTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

export const getCartItemCount = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const formatPrice = (price: number | string | undefined | null): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : (price ?? 0);
    return `$${(Number.isNaN(numPrice) ? 0 : numPrice).toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Helper to safely get image URL with fallback
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400';

export const getImageUrl = (
    imageUrl?: string | null,
    images?: string[] | null,
    fallback: string = PLACEHOLDER_IMAGE
): string => {
    // Check imageUrl first
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
        return imageUrl;
    }
    // Then check images array
    if (images && Array.isArray(images) && images.length > 0 && images[0]) {
        return images[0];
    }
    // Return fallback
    return fallback;
};
