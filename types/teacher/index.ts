// import { Types } from 'mongoose';
import { ICreateUserDto, IUpdateUserDto } from "../user";

export interface IQualification {
  degree: string;
  institution: string;
  year: number;
  specialization: string;
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export interface ITeacher {
  qualifications: IQualification[];
  availability: Map<string, ITimeSlot[]>;
  rating: number[];
  courses: string[];
  organizationId: string;
  languages: string[];
  subscription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeacherDto extends ICreateUserDto {
  qualifications?: IQualification[];
  availability?: Map<string, ITimeSlot[]>;
  rating?: number[];
  courses?: string[];
  organizationId: string;
  languages?: string[];
  subscription?: string;
}

export type IUpdateTeacherDto = Partial<ICreateTeacherDto> &
  Partial<IUpdateUserDto>;
