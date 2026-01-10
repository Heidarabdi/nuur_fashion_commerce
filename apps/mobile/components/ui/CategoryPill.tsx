import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { palette, spacing, fontFamilies } from '@/constants/theme';
import { Category } from '@/constants/mock-data';

interface CategoryPillProps {
    category: Category;
    onPress?: () => void;
    style?: ViewStyle;
}

export function CategoryPill({ category, onPress, style }: CategoryPillProps) {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: category.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.label}>{category.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.borderLight,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    label: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 12,
        color: palette.textSecondary,
    },
});
