import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { spacing, fontFamilies } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    subtitle: string;
    image: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Discover Your Style',
        subtitle: 'Explore curated collections of premium fashion pieces crafted for the modern woman.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    },
    {
        id: '2',
        title: 'Timeless Elegance',
        subtitle: 'Find pieces that transcend seasons. Quality fabrics, expert craftsmanship.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    },
    {
        id: '3',
        title: 'Start Your Journey',
        subtitle: 'Create your wishlist, save your favorites, and enjoy personalized recommendations.',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    },
];

export const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export default function OnboardingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleNext = async () => {
        if (currentIndex < slides.length - 1) {
            scrollRef.current?.scrollTo({
                x: (currentIndex + 1) * width,
                animated: true,
            });
        } else {
            await handleComplete();
        }
    };

    const handleSkip = async () => {
        await handleComplete();
    };

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
            // Use replace to prevent going back to onboarding
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error completing onboarding:', error);
            router.replace('/(tabs)');
        }
    };

    const isLastSlide = currentIndex === slides.length - 1;

    return (
        <View style={styles.container}>
            {/* Slides */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {slides.map((slide, index) => (
                    <View key={slide.id} style={styles.slide}>
                        <View style={[styles.imageContainer, { marginTop: insets.top + 40 }]}>
                            <Image
                                source={{ uri: slide.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.imageOverlay} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.subtitle}>{slide.subtitle}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Section */}
            <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.lg }]}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Action Buttons - Skip left, Next right */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>
                            {isLastSlide ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width,
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        marginHorizontal: spacing.lg,
        borderRadius: 32,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    textContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Playfair_700Bold',
        fontSize: 32,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    subtitle: {
        fontFamily: fontFamilies.sans,
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    bottomSection: {
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
    },
    dotActive: {
        width: 24,
        backgroundColor: colors.primary,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.lg,
    },
    skipButton: {
        flex: 1,
        paddingVertical: spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    skipText: {
        fontFamily: fontFamilies.sansMedium,
        fontSize: 16,
        color: colors.text,
    },
    actionButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
    },
    actionButtonText: {
        fontFamily: fontFamilies.sansSemiBold,
        fontSize: 16,
        color: colors.white,
    },
});
