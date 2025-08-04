// import { Types } from 'mongoose';
import { ICreateUserDto, IUpdateUserDto } from '../user';

export enum AdminAccessLevel {
  SUPERADMIN = 'superadmin',
  MODERATOR = 'moderator',
}

export interface IAdmin {
  userId: string;
  accessLevel: AdminAccessLevel;
  managedOrganizations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAdminDto extends ICreateUserDto {
  accessLevel?: AdminAccessLevel;
  managedOrganizations?: string[];
}

export type IUpdateAdminDto = Partial<IUpdateUserDto> & {
  accessLevel?: AdminAccessLevel;
  managedOrganizations?: string[];
};
