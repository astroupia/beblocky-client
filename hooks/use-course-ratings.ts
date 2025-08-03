import { useState, useCallback } from "react";
import { courseApi } from "@/lib/api/course";
import type {
  ICourseRatingResponse,
  ICourseRatingStats,
  RatingValue,
} from "@/types/dashboard";

interface UseCourseRatingsReturn {
  reviews: ICourseRatingResponse[];
  ratingStats: ICourseRatingStats | null;
  userRating: RatingValue | null;
  userReview: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadReviews: () => Promise<void>;
  submitReview: (rating: RatingValue, review?: string) => Promise<void>;
  updateReview: (rating: RatingValue, review?: string) => Promise<void>;
  deleteReview: () => Promise<void>;
  setUserRating: (rating: RatingValue) => void;
  setUserReview: (review: string) => void;
}

export function useCourseRatings(
  courseId: string,
  userId: string
): UseCourseRatingsReturn {
  const [reviews, setReviews] = useState<ICourseRatingResponse[]>([]);
  const [ratingStats, setRatingStats] = useState<ICourseRatingStats | null>(
    null
  );
  const [userRating, setUserRating] = useState<RatingValue | null>(null);
  const [userReview, setUserReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!courseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [ratingsResponse, statsResponse] = await Promise.all([
        courseApi.getCourseRatings(courseId),
        courseApi.getRatingStats(courseId, userId),
      ]);

      setReviews(ratingsResponse);
      setRatingStats(statsResponse);

      // Set user's existing rating if any
      if (statsResponse.userRating) {
        setUserRating(statsResponse.userRating);
      }
      if (statsResponse.userReview) {
        setUserReview(statsResponse.userReview);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load reviews";
      setError(errorMessage);
      console.error("Error loading reviews:", err);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, userId]);

  const submitReview = useCallback(
    async (rating: RatingValue, review?: string) => {
      if (!courseId || !userId) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const ratingData = {
          rating,
          review: review?.trim() || undefined,
        };

        await courseApi.rateCourse(courseId, userId, ratingData);

        // Reload reviews to show updated data
        await loadReviews();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit review";
        setError(errorMessage);
        console.error("Error submitting review:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [courseId, userId, loadReviews]
  );

  const updateReview = useCallback(
    async (rating: RatingValue, review?: string) => {
      if (!courseId || !userId) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const ratingData = {
          rating,
          review: review?.trim() || undefined,
        };

        await courseApi.updateRating(courseId, userId, ratingData);

        // Reload reviews to show updated data
        await loadReviews();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update review";
        setError(errorMessage);
        console.error("Error updating review:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [courseId, userId, loadReviews]
  );

  const deleteReview = useCallback(async () => {
    if (!courseId || !userId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await courseApi.deleteRating(courseId, userId);
      setUserRating(null);
      setUserReview("");

      // Reload reviews to show updated data
      await loadReviews();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete review";
      setError(errorMessage);
      console.error("Error deleting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [courseId, userId, loadReviews]);

  return {
    reviews,
    ratingStats,
    userRating,
    userReview,
    isLoading,
    isSubmitting,
    error,
    loadReviews,
    submitReview,
    updateReview,
    deleteReview,
    setUserRating,
    setUserReview,
  };
}
