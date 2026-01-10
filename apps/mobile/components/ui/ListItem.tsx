import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, radius, spacing, fontFamilies } from '@/constants/theme';

interface ListItemProps extends Omit<TouchableOpacityProps, 'style'> {
    title: string;
    subtitle?: string;
    leftIcon?: React.ReactNode | keyof typeof Ionicons.glyphMap;
    rightIcon?: React.ReactNode | keyof typeof Ionicons.glyphMap;
    showArrow?: boolean;
    showChevron?: boolean;
    iconBackgroundColor?: string;
    style?: ViewStyle;
}

export function ListItem({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    showArrow,
    showChevron = true,
    iconBackgroundColor = palette.accent,
    style,
    ...props
}: ListItemProps) {
    const renderIcon = (icon: React.ReactNode | keyof typeof Ionicons.glyphMap | undefined, color: string) => {
        if (!icon) return null;

        // If it's a React element, render directly
        if (React.isValidElement(icon)) {
            return icon;
        }

        // If it's a string (icon name), render Ionicons
        if (typeof icon === 'string') {
            return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={color} />;
        }

        return null;
    };

    const showArrowIcon = showArrow ?? showChevron;

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            activeOpacity={0.7}
            {...props}
        >
            {leftIcon && (
                <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
                    {renderIcon(leftIcon, palette.textSecondary)}
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {rightIcon ? (
                renderIcon(rightIcon, palette.textMuted)
            ) : showArrowIcon ? (
                <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderRadius: radius.xl,
        padding: spacing.md,
        gap: spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 16,
        color: palette.text,
    },
    subtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 13,
        color: palette.textSecondary,
    },
});
