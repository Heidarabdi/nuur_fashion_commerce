import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, fontFamilies } from '@/constants/theme';

interface AvatarProps {
    source?: string;
    name?: string;
    size?: number;
    showEditBadge?: boolean;
    onEditPress?: () => void;
    style?: ViewStyle;
}

export function Avatar({
    source,
    name,
    size = 96,
    showEditBadge = false,
    onEditPress,
    style,
}: AvatarProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {source ? (
                <Image
                    source={{ uri: source }}
                    style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        { width: size, height: size, borderRadius: size / 2 },
                    ]}
                >
                    <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
                        {name ? getInitials(name) : '?'}
                    </Text>
                </View>
            )}

            {showEditBadge && (
                <TouchableOpacity
                    style={styles.editBadge}
                    onPress={onEditPress}
                    activeOpacity={0.8}
                >
                    <Ionicons name="pencil" size={12} color={palette.white} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        backgroundColor: palette.accent,
    },
    placeholder: {
        backgroundColor: palette.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontFamily: fontFamilies.sansSemiBold,
        color: palette.white,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: palette.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: palette.surface,
    },
});
