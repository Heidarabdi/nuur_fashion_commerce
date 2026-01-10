import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, spacing, fontFamilies } from '@/constants/theme';

interface HeaderProps {
    title?: string;
    showLogo?: boolean;
    showBack?: boolean;
    showCart?: boolean;
    showMenu?: boolean;
    cartCount?: number;
    rightAction?: React.ReactNode;
    onMenuPress?: () => void;
    style?: ViewStyle;
}

export function Header({
    title,
    showLogo = false,
    showBack = false,
    showCart = false,
    showMenu = false,
    cartCount = 0,
    rightAction,
    onMenuPress,
    style,
}: HeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + spacing.sm }, style]}>
            {/* Left */}
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={palette.text} />
                    </TouchableOpacity>
                )}
                {showMenu && (
                    <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
                        <Ionicons name="menu" size={24} color={palette.text} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Center */}
            <View style={styles.center}>
                {showLogo ? (
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>Nuur</Text>
                        <Text style={styles.logoSubtitle}>FASHION</Text>
                    </View>
                ) : title ? (
                    <Text style={styles.title}>{title}</Text>
                ) : null}
            </View>

            {/* Right */}
            <View style={styles.right}>
                {showCart && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push('/cart')}
                    >
                        <Ionicons name="bag-outline" size={24} color={palette.text} />
                        {cartCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {cartCount > 9 ? '9+' : cartCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
                {rightAction}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: palette.background,
    },
    left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    center: {
        flex: 2,
        alignItems: 'center',
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconButton: {
        padding: spacing.xs,
        position: 'relative',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 24,
        color: palette.text,
        letterSpacing: 2,
    },
    logoSubtitle: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 8,
        letterSpacing: 3,
        color: palette.textSecondary,
        marginTop: -2,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: palette.text,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: palette.primary,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 10,
        color: palette.white,
    },
});
