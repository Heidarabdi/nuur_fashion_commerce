import React, { useMemo } from 'react';
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
import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

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
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={[styles.container, { paddingTop: insets.top + spacing.sm }, style]}>
            {/* Left */}
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                )}
                {showMenu && (
                    <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
                        <Ionicons name="menu" size={24} color={colors.text} />
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
                        <Ionicons name="bag-outline" size={24} color={colors.text} />
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
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
        color: colors.text,
        letterSpacing: 2,
    },
    logoSubtitle: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 8,
        letterSpacing: 3,
        color: colors.textSecondary,
        marginTop: -2,
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 20,
        color: colors.text,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 10,
        color: colors.white,
    },
});
