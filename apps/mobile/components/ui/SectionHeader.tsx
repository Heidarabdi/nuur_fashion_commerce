import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { palette, spacing, fontFamilies } from '@/constants/theme';

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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: palette.text,
    },
    action: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 12,
        color: palette.textSecondary,
    },
});
