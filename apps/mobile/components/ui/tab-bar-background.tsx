import { View, StyleSheet, Platform } from 'react-native';

/**
 * Simple TabBarBackground component.
 * iOS blur effect would require expo-blur installation.
 */
export default function TabBarBackground() {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: Platform.select({ ios: 'rgba(255,255,255,0.9)', default: '#fff' }) }]} />;
}

export function useBottomTabOverflow() {
    // Return 0 since we're not using blur effect
    return 0;
}
