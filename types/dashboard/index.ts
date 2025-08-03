// Dashboard Types (cleaned from mongoose/firebase dependencies)

// Course Types
export enum CourseSubscriptionType {
  FREE = "free",
  STARTER = "starter",
  BUILDER = "builder",
  PRO = "pro-bundle",
  ORGANIZATION = "organization",
}

export enum CourseStatus {
  ACTIVE = "Active",
  DRAFT = "Draft",
}

export interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: CourseSubscriptionType;
  status: CourseStatus;
  rating: number;
  language: string;
  progress?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
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

// Slide Types
export interface ISlide {
  _id: string;
  title: string;
  content?: string;
  order: number;
  courseId: string;
  lessonId: string;
  titleFont?: string;
  contentFont?: string;
  startingCode?: string;
  solutionCode?: string;
  imageUrls?: string[];
  backgroundColor?: string;
  textColor?: string;
  themeColors?: {
    main: string;
    secondary: string;
  };
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICreateSlideDto {
  title: string;
  content?: string;
  order: number;
  courseId: string;
  lessonId: string;
  titleFont?: string;
  contentFont?: string;
  startingCode?: string;
  solutionCode?: string;
  imageUrls?: string[];
  backgroundColor?: string;
  textColor?: string;
  themeColors?: {
    main: string;
    secondary: string;
  };
  imageUrl?: string;
  videoUrl?: string;
}

export type IUpdateSlideDto = Partial<
  Omit<ICreateSlideDto, "courseId" | "lessonId">
>;

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

// User Types
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum RelationshipType {
  MOTHER = "mother",
  FATHER = "father",
  GUARDIAN = "guardian",
  OTHER = "other",
}

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  dateOfBirth?: string | Date;
  grade?: number;
  gender?: Gender;
  enrolledCourses: string[];
  coins: number;
  codingStreak: number;
  lastCodingActivity: string | Date;
  totalCoinsEarned: number;
  totalTimeSpent: number;
  goals?: string[];
  subscription?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICreateStudentDto {
  name: string;
  email: string;
  dateOfBirth?: string | Date;
  grade?: number;
  gender?: Gender;
  subscription?: string;
  goals?: string[];
}

export interface IUpdateStudentDto extends Partial<ICreateStudentDto> {
  enrolledCourses?: string[];
  coins?: number;
  codingStreak?: number;
  totalCoinsEarned?: number;
  totalTimeSpent?: number;
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

export interface IParent {
  _id: string;
  name: string;
  email: string;
  children: string[];
  relationship: RelationshipType;
  phoneNumber: string;
  address: {
    subCity: string;
    city: string;
    country: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

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

// Course Rating Types
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
