import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '@/constants/theme';

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
    const { container: containerSize, icon: iconSize } = sizeConfig[size];

    const getIconColor = () => {
        if (color) return color;
        switch (variant) {
            case 'filled':
                return palette.white;
            case 'outline':
            case 'ghost':
                return palette.text;
            default:
                return palette.textSecondary;
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

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    default: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    filled: {
        backgroundColor: palette.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: palette.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
});
