import React, { useMemo } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
} from 'react-native';

import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface Category {
    id: string;
    name: string;
    image?: string;
}

interface CategoryPillProps {
    label?: string;
    category?: Category;
    selected?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

export function CategoryPill({
    label,
    category,
    selected = false,
    onPress,
    style,
}: CategoryPillProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Use label prop or get name from category object
    const displayLabel = label || category?.name || '';

    return (
        <TouchableOpacity
            style={[
                styles.pill,
                selected && styles.pillSelected,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, selected && styles.labelSelected]}>
                {displayLabel}
            </Text>
        </TouchableOpacity>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    pill: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderLight,
        backgroundColor: 'transparent',
    },
    pillSelected: {
        backgroundColor: colors.text,
        borderColor: colors.text,
    },
    label: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.textSecondary,
    },
    labelSelected: {
        color: colors.white,
    },
});
