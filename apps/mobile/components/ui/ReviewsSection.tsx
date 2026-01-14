/**
 * Reviews Section Component
 * Displays product reviews and allows adding new reviews
 */
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProductReviews, useCreateReview } from '@nuur-fashion-commerce/api';
import { useSession } from '@/lib/auth-client';
import { StarRating } from './StarRating';
import { useTheme } from '@/contexts/theme-context';
import { spacing, fontFamilies, radius } from '@/constants/theme';

interface ReviewsSectionProps {
    productId: string;
}

interface Review {
    id: string;
    rating: number;
    title?: string;
    content?: string;
    createdAt: string;
    user?: {
        name?: string;
    };
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const router = useRouter();
    const session = useSession();
    const isLoggedIn = !!session.data?.user;

    const { data: reviewsData, isLoading } = useProductReviews(productId);
    const createReview = useCreateReview();

    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const reviews: Review[] = reviewsData || [];
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

    const handleSubmitReview = async () => {
        if (rating < 1) {
            Alert.alert('Rating Required', 'Please select a star rating');
            return;
        }

        try {
            await createReview.mutateAsync({
                productId,
                rating,
                title: title || undefined,
                content: content || undefined,
            });

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your review has been submitted!',
            });
            setShowForm(false);
            setRating(5);
            setTitle('');
            setContent('');
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to submit review. Please try again.',
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Customer Reviews</Text>
                <View style={styles.ratingRow}>
                    <StarRating rating={Math.round(averageRating)} color={colors.primary} />
                    <Text style={styles.ratingText}>
                        {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </Text>
                </View>
            </View>

            {/* Write Review Button - Below header */}
            {!showForm && isLoggedIn && (
                <TouchableOpacity
                    style={styles.writeButton}
                    onPress={() => setShowForm(true)}
                >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                    <Text style={styles.writeButtonText}>Write a Review</Text>
                </TouchableOpacity>
            )}

            {/* Login Prompt for Guests */}
            {!showForm && !isLoggedIn && (
                <TouchableOpacity
                    style={styles.loginPrompt}
                    onPress={() => router.push('/auth/login')}
                >
                    <Ionicons name="person-outline" size={18} color={colors.primary} />
                    <Text style={styles.loginPromptText}>Sign in to write a review</Text>
                </TouchableOpacity>
            )}

            {/* Review Form */}
            {showForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Write Your Review</Text>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Your Rating</Text>
                        <StarRating
                            rating={rating}
                            size={28}
                            color={colors.primary}
                            interactive
                            onRatingChange={setRating}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Title (optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Summarize your experience"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Review (optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={content}
                            onChangeText={setContent}
                            placeholder="Share your thoughts about this product..."
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.formButtons}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmitReview}
                            disabled={createReview.isPending}
                        >
                            {createReview.isPending ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Submit Review</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setShowForm(false);
                                setRating(5);
                                setTitle('');
                                setContent('');
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubble-outline" size={48} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>No reviews yet</Text>
                    <Text style={styles.emptySubtext}>Be the first to review this product!</Text>
                </View>
            ) : (
                <View style={styles.reviewsList}>
                    {reviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewUser}>
                                    <View style={styles.avatar}>
                                        <Ionicons name="person" size={16} color={colors.primary} />
                                    </View>
                                    <View>
                                        <Text style={styles.userName}>
                                            {review.user?.name || 'Anonymous'}
                                        </Text>
                                        <Text style={styles.reviewDate}>
                                            {formatDate(review.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                                <StarRating rating={review.rating} size={14} color={colors.primary} />
                            </View>

                            {review.title && (
                                <Text style={styles.reviewTitle}>{review.title}</Text>
                            )}
                            {review.content && (
                                <Text style={styles.reviewContent}>{review.content}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        marginTop: spacing.xl,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    header: {
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 20,
        fontFamily: fontFamilies.display,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    ratingText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    writeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.lg,
    },
    writeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        borderWidth: 1.5,
        borderColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.lg,
    },
    loginPromptText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    formContainer: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    formField: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: 16,
        color: colors.text,
    },
    textArea: {
        minHeight: 100,
        paddingTop: spacing.sm,
    },
    formButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    submitButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.md,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    reviewsList: {
        gap: spacing.md,
    },
    reviewCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${colors.primary}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    reviewDate: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    reviewTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    reviewContent: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});
