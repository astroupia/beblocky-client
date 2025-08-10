// Dashboard Types (cleaned from mongoose/firebase dependencies)

// Import types from other modules
export type { ICourse } from "../course";
export type {
  IStudent,
  ICreateStudentDto,
  IUpdateStudentDto,
} from "../student";
export type { IParent, ICreateParentDto, IUpdateParentDto } from "../parent";
export type { ISlide, ICreateSlideDto, IUpdateSlideDto } from "../slide";
export type {
  ISubscription,
  ICreateSubscriptionDto,
  IUpdateSubscriptionDto,
} from "../subscription";

// Re-export enums
export { CourseSubscriptionType, CourseStatus } from "../course";
export { Gender } from "../student";
export { RelationshipType } from "../parent";
export { SubscriptionPlan, SubscriptionStatus } from "../subscription";

// Dashboard-specific types that extend the base types
export interface IStudentDashboard extends IStudent {
  // Additional dashboard-specific properties can be added here
}

export interface IParentDashboard extends IParent {
  // Additional dashboard-specific properties can be added here
}

export interface ISlideDashboard extends ISlide {
  // Additional dashboard-specific properties can be added here
}

// Lesson Types
export enum LessonDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface ILesson {
  _id: string;
  title: string;
  description?: string;
  courseId: string;
  slides: string[];
  difficulty: LessonDifficulty;
  duration: number;
  tags: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICreateLessonDto {
  title: string;
  description?: string;
  courseId: string;
  slides?: string[];
  difficulty?: LessonDifficulty;
  duration: number;
  tags?: string[];
}

export type IUpdateLessonDto = Partial<ICreateLessonDto>;

export interface IAddSlideDto {
  slideId: string;
}

export interface IReorderLessonsDto {
  lessonIds: string[];
}

// Course DTOs
export interface ICreateCourseDto {
  courseTitle: string;
  courseDescription?: string;
  courseLanguage: string;
  lessonIds?: string[];
  slideIds?: string[];
  organization?: string[];
  subType?: CourseSubscriptionType;
  status?: CourseStatus;
  rating?: number;
  language?: string;
}

export type IUpdateCourseDto = Partial<ICreateCourseDto>;

export interface ICreateCourseWithContentDto {
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  lessons?: ICreateLessonDto[];
  slides?: ICreateSlideDto[];
  subType?: CourseSubscriptionType;
  status?: CourseStatus;
  rating?: number;
  language?: string;
}

// Progress Types
export interface IProgress {
  _id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  slideId?: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  completedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IStudentProgress {
  _id: string;
  studentId: string;
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  totalTimeSpent: number;
  lastActivity: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IProgressResponse {
  progress: IProgress;
  percentage: number;
  totalLessons: number;
  completedLessons: number;
}

export interface IChildProgressSummary {
  child: IStudent;
  courses: Array<{
    course: ICourse;
    progress: IProgressResponse;
  }>;
}

// Stats Types
export interface IStudentStats {
  totalCourses: number;
  activeCourses: number;
  totalCoins: number;
  codingStreak: number;
  timeSpent: number;
  averageProgress: number;
}

export interface IParentStats {
  totalChildren: number;
  activeChildren: number;
  totalTimeSpent: number;
  averageProgress: number;
  totalCoinsEarned: number;
}

// Dashboard Props
export interface IStudentDashboardProps {
  courses: ICourse[];
  stats: IStudentStats;
  selectedTab?: "overview" | "courses" | "children";
}

export interface IParentDashboardProps {
  parent: IParent;
  children: IStudent[];
  stats: IParentStats;
}

export type UserType = "student" | "parent";

export interface IDashboardProps {
  userType: UserType;
  user: IStudent | IParent;
  courses: ICourse[];
  children?: IStudent[];
  stats: IStudentStats | IParentStats;
}

// Rating Types
export enum RatingValue {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export interface ICourseRating {
  courseId: string;
  userId: string;
  rating: RatingValue;
  review?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICreateCourseRatingDto {
  rating: RatingValue;
  review?: string;
}

export type IUpdateCourseRatingDto = Partial<ICreateCourseRatingDto>;

export interface ICourseRatingResponse {
  id: string;
  courseId: string;
  userId: string;
  rating: RatingValue;
  review?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICourseRatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    [key: number]: number;
  };
  userRating?: RatingValue;
  userReview?: string;
}
