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
