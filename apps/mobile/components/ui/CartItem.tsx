import React, { useMemo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, fontFamilies } from '@/constants/theme';
import { formatCurrency } from '@nuur-fashion-commerce/shared';
import { QuantityStepper } from './QuantityStepper';
import { useTheme } from '@/contexts/theme-context';
import { getProductImageUrl, PlaceholderImage } from '@/utils/image';

// Local cart item type
interface CartItemType {
    id: string;
    product: {
        id: string;
        name: string;
        price: number | string;
        image?: string | { url: string };
        images?: { url: string }[];
    };
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

interface CartItemProps {
    item: CartItemType;
    onQuantityChange?: (quantity: number) => void;
    onRemove?: () => void;
    style?: ViewStyle;
}

export function CartItem({
    item,
    onQuantityChange,
    onRemove,
    style,
}: CartItemProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const { product, quantity, selectedColor, selectedSize } = item;

    // Get image URL using centralized utility
    const imageUrl = getProductImageUrl(product);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <PlaceholderImage
                        name={product?.name || 'Product'}
                        width={80}
                        height={100}
                        style={styles.image}
                    />
                )}
            </View>

            <View style={styles.details}>
                <View style={styles.header}>
                    <View style={styles.info}>
                        <Text style={styles.name} numberOfLines={1}>
                            {product.name}
                        </Text>
                        <Text style={styles.variant}>
                            {selectedColor ? `${selectedSize} · ` : ''}{selectedSize}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onRemove}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>{formatCurrency(product.price)}</Text>
                    <QuantityStepper
                        value={quantity}
                        onChange={onQuantityChange}
                        min={1}
                        max={10}
                    />
                </View>
            </View>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    imageContainer: {
        width: 96,
        height: 128,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.accent,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    info: {
        flex: 1,
        marginRight: spacing.sm,
    },
    name: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 16,
        color: colors.text,
    },
    variant: {
        fontFamily: fontFamilies.sans,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 18,
        color: colors.text,
    },
});
