import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface QuantityStepperProps {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    style?: ViewStyle;
}

export function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 99,
    style,
}: QuantityStepperProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const handleDecrement = () => {
        if (value > min) {
            onChange?.(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange?.(value + 1);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleDecrement}
                disabled={value <= min}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="remove"
                    size={16}
                    color={value <= min ? colors.textMuted : colors.text}
                />
            </TouchableOpacity>

            <Text style={styles.value}>{value}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleIncrement}
                disabled={value >= max}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="add"
                    size={16}
                    color={value >= max ? colors.textMuted : colors.text}
                />
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accent,
        borderRadius: radius.full,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xs,
    },
    button: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 14,
        color: colors.text,
        minWidth: 32,
        textAlign: 'center',
    },
});
