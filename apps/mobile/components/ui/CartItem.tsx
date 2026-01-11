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
import { CartItem as CartItemType, formatPrice } from '@/constants/mock-data';
import { QuantityStepper } from './QuantityStepper';
import { useTheme } from '@/contexts/theme-context';

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

    return (
        <View style={[styles.container, style]}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
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
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>
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
