// import { Types } from 'mongoose';
// import { ThemeColorsDto } from '../../shared/dtos/theme-colors.dto';

export interface ISlide {
  title: string;
  content?: string;
  course: string;
  lesson?: string;
  order: number;
  titleFont: string;
  startingCode?: string;
  solutionCode?: string;
  imageUrls: string[];
  backgroundColor: string;
  textColor: string;
  themeColors: {
    main: string;
    secondary: string;
  };
  createdAt: Date;
  updatedAt: Date;
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
  themeColors?: any;
  imageUrl?: string;
  videoUrl?: string;
}

export type IUpdateSlideDto = Partial<
  Omit<ICreateSlideDto, "courseId" | "lessonId">
>;

export interface IReorderSlidesDto {
  slideIds: string[];
}

export interface IAddMediaDto {
  mediaUrl: string;
  type: "image" | "video";
}
