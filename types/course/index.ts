// import { Types } from "mongoose";
// import { ICreateLessonDto, ICreateSlideDto } from "..";

export enum CourseSubscriptionType {
  FREE = "Free",
  STARTER = "Starter",
  BUILDER = "Builder",
  PRO = "Pro-Bundle",
  ORGANIZATION = "Organization",
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
  slides: string[];
  lessons: string[];
  students: string[];
  organization: string[];
  subType: CourseSubscriptionType;
  status: CourseStatus;
  rating: number;
  language: string;
  progress?: number; // Progress percentage for enrolled students
  createdAt: Date;
  updatedAt: Date;
}

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
  lessons?: any[];
  slides?: any[];
  subType?: CourseSubscriptionType;
  status?: CourseStatus;
  rating?: number;
  language?: string;
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
  userId: string; // String ID from better-auth
  rating: RatingValue;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
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
