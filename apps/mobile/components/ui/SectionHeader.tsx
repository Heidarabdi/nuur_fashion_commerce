import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface SectionHeaderProps {
    title: string;
    actionText?: string;
    onActionPress?: () => void;
    style?: ViewStyle;
}

export function SectionHeader({
    title,
    actionText,
    onActionPress,
    style,
}: SectionHeaderProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>{title}</Text>
            {actionText && (
                <TouchableOpacity onPress={onActionPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.action}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: colors.text,
    },
    action: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 12,
        color: colors.textSecondary,
    },
});
