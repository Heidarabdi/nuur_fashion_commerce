import React, { useMemo } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/theme-context';

type IconButtonVariant = 'default' | 'filled' | 'outline' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
    icon: keyof typeof Ionicons.glyphMap;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    color?: string;
    style?: ViewStyle;
}

const sizeConfig = {
    sm: { container: 32, icon: 18 },
    md: { container: 40, icon: 22 },
    lg: { container: 48, icon: 26 },
};

export function IconButton({
    icon,
    variant = 'default',
    size = 'md',
    color,
    style,
    disabled,
    ...props
}: IconButtonProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { container: containerSize, icon: iconSize } = sizeConfig[size];

    const getIconColor = () => {
        if (color) return color;
        switch (variant) {
            case 'filled':
                return colors.white;
            case 'outline':
            case 'ghost':
                return colors.text;
            default:
                return colors.textSecondary;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.base,
                styles[variant],
                {
                    width: containerSize,
                    height: containerSize,
                    borderRadius: containerSize / 2,
                },
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled}
            activeOpacity={0.7}
            {...props}
        >
            <Ionicons name={icon} size={iconSize} color={getIconColor()} />
        </TouchableOpacity>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    default: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    filled: {
        backgroundColor: colors.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
});
