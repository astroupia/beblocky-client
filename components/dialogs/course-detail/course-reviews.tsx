import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { courseApi } from "@/lib/api/course";
import type {
  ICourse,
  ICourseRatingResponse,
  ICourseRatingStats,
} from "@/types/course";

interface CourseReviewsProps {
  course: ICourse;
  userId?: string;
  isValidUserId: boolean;
}

export function CourseReviews({
  course,
  userId,
  isValidUserId,
}: CourseReviewsProps) {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<ICourseRatingResponse[]>([]);
  const [ratingStats, setRatingStats] = useState<ICourseRatingStats | null>(
    null
  );
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!course) return;

    setIsLoadingReviews(true);
    try {
      // Only fetch user-specific stats if we have a valid userId
      const [ratingsResponse, statsResponse] = await Promise.all([
        courseApi.getCourseRatings(course._id),
        isValidUserId
          ? courseApi.getRatingStats(course._id, userId!)
          : courseApi.getRatingStats(course._id), // Without userId
      ]);

      // Safely set reviews with fallback to empty array
      setReviews(ratingsResponse || []);

      // Safely set rating stats with fallback to null
      setRatingStats(statsResponse || null);

      // Set user's existing rating if any (with safe navigation)
      if (statsResponse?.userRating) {
        setUserRating(statsResponse.userRating);
      } else {
        setUserRating(0); // Reset if no user rating
      }

      if (statsResponse?.userReview) {
        setUserReview(statsResponse.userReview);
      } else {
        setUserReview(""); // Reset if no user review
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      // Set default values on error
      setReviews([]);
      setRatingStats(null);
      setUserRating(0);
      setUserReview("");
    } finally {
      setIsLoadingReviews(false);
    }
  }, [course, userId, isValidUserId]);

  useEffect(() => {
    if (course && showReviews) {
      loadReviews();
    }
  }, [course, showReviews, loadReviews]);

  const handleSubmitReview = async () => {
    if (!course || !isValidUserId || userRating === 0) {
      console.error(
        "Cannot submit review: missing course, valid userId, or rating"
      );
      return;
    }

    setIsSubmittingReview(true);
    try {
      const ratingData = {
        rating: userRating,
        review: userReview.trim() || undefined,
      };

      if (ratingStats?.userRating) {
        // Update existing rating
        await courseApi.updateRating(course._id, userId!, ratingData);
      } else {
        // Create new rating
        await courseApi.rateCourse(course._id, userId!, ratingData);
      }

      // Reload reviews to show updated data
      await loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      // Show user-friendly error message
      alert("Failed to submit review. Please try again later.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!course || !isValidUserId) {
      console.error("Cannot delete review: missing course or valid userId");
      return;
    }

    try {
      await courseApi.deleteRating(course._id, userId!);
      setUserRating(0);
      setUserReview("");
      await loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again later.");
    }
  };

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews & Ratings
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReviews(!showReviews)}
          >
            {showReviews ? "Hide" : "Show"} Reviews
          </Button>
        </div>

        {showReviews && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Rating Stats */}
            {ratingStats && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {ratingStats.averageRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Average Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {ratingStats.totalRatings}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Reviews
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {ratingStats.userRating ? "✓" : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Your Rating
                  </div>
                </div>
              </div>
            )}

            {/* Add Review Form */}
            {isValidUserId ? (
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Write a Review</h4>
                <p className="text-xs text-muted-foreground">
                  User ID: {userId!.substring(0, 10)}...
                </p>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= userRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {userRating > 0
                      ? `${userRating} star${userRating > 1 ? "s" : ""}`
                      : "Select rating"}
                  </span>
                </div>

                {/* Review Text */}
                <Textarea
                  placeholder="Share your experience with this course..."
                  value={userReview}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setUserReview(e.target.value)
                  }
                  className="min-h-[80px]"
                />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={userRating === 0 || isSubmittingReview}
                    size="sm"
                    className="gap-2"
                  >
                    {isSubmittingReview ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {ratingStats?.userRating ? "Update" : "Submit"} Review
                  </Button>

                  {ratingStats?.userRating && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteReview}
                    >
                      Delete Review
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Please sign in to write a review</p>
              </div>
            )}

            {/* Reviews List */}
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Recent Reviews</h4>
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.review && (
                      <p className="text-sm text-muted-foreground">
                        {review.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <p>No reviews yet. Be the first to review this course!</p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
