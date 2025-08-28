import { Button } from "@/components/ui/button";
import { Play, Plus, CheckCircle } from "lucide-react";
import { CourseSubscriptionType } from "@/types/course";
import { canAccessCourse } from "@/lib/utils/subscription-hierarchy";

interface CourseActionsProps {
  course: any;
  userType: "student" | "parent";
  isLoading: boolean;
  isEnrolled: boolean;
  subscription?: any;
  onEnroll?: (courseId: string) => void;
  onAddToPlan?: (courseId: string) => void;
  onClose: () => void;
}

export function CourseActions({
  course,
  userType,
  isLoading,
  isEnrolled,
  subscription,
  onEnroll,
  onAddToPlan,
  onClose,
}: CourseActionsProps) {
  // Check if user has the same course (for parent users)
  const userHasSameCourse =
    course?.progress !== undefined && course?.progress > 0;

  // Determine if Add to Plan should be visible per hierarchy
  const shouldShowAddToPlan = (() => {
    if (!course) return false;
    // 1) Free plan courses should NOT show add to plan
    if (course.subType === CourseSubscriptionType.FREE) return false;
    // 2) If user plan already covers this course level, hide
    const userPlan = subscription?.planName || null;
    const covered = canAccessCourse(userPlan as any, course.subType);
    return !covered;
  })();

  // Determine if current user has access to this course level
  const studentHasAccess = (() => {
    if (!course) return false;
    const userPlan = subscription?.planName || null;
    return canAccessCourse(userPlan as any, course.subType);
  })();

  const handleAction = async () => {
    if (userType === "student") {
      onEnroll?.(course._id);
    } else {
      onAddToPlan?.(course._id);
    }
    onClose();
  };

  return (
    <div className="flex gap-3 pt-4 border-t">
      <Button
        variant="outline"
        onClick={onClose}
        className="flex-1 bg-transparent"
      >
        Close
      </Button>

      {userType === "student" ? (
        studentHasAccess ? (
          <Button
            onClick={handleAction}
            disabled={isLoading || isEnrolled}
            className="flex-1 gap-2"
          >
            {isLoading ? (
              "Enrolling..."
            ) : isEnrolled ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Already Enrolled
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {course.progress ? "Continue Learning" : "Enroll Now"}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => onAddToPlan?.(course._id)}
            disabled={isLoading}
            className="flex-1 gap-2"
          >
            {isLoading ? (
              "Adding..."
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Plan
              </>
            )}
          </Button>
        )
      ) : shouldShowAddToPlan && !userHasSameCourse ? (
        <Button
          onClick={handleAction}
          disabled={isLoading}
          className="flex-1 gap-2"
        >
          {isLoading ? (
            "Adding..."
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Plan
            </>
          )}
        </Button>
      ) : (
        <Button variant="outline" disabled className="flex-1 gap-2">
          <CheckCircle className="h-4 w-4" />
          Already in Plan
        </Button>
      )}
    </div>
  );
}
