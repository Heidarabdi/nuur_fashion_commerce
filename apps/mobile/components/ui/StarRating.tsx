/**
 * Star Rating Component
 * Displays and optionally allows selecting star ratings
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    color?: string;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 18,
    color = '#BC6C4D',
    onRatingChange,
    interactive = false,
}: StarRatingProps) {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        const filled = i <= rating;
        const StarWrapper = interactive ? TouchableOpacity : View;

        stars.push(
            <StarWrapper
                key={i}
                onPress={interactive ? () => onRatingChange?.(i) : undefined}
                style={interactive ? styles.starButton : undefined}
            >
                <Ionicons
                    name={filled ? 'star' : 'star-outline'}
                    size={size}
                    color={filled ? color : '#E2E8F0'}
                />
            </StarWrapper>
        );
    }

    return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    starButton: {
        padding: 4,
    },
});
