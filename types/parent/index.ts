// import { Types } from 'mongoose';
import { ICreateUserDto, IUpdateUserDto } from "../user";

export enum RelationshipType {
  MOTHER = "mother",
  FATHER = "father",
  GUARDIAN = "guardian",
  OTHER = "other",
}

export interface IAddress {
  subCity: string;
  city: string;
  country: string;
}

export interface IParent {
  userId: string;
  children: string[];
  relationship: RelationshipType;
  phoneNumber: string;
  address: IAddress;
  subscription: string;
  paymentHistory: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateParentDto extends ICreateUserDto {
  children?: string[];
  relationship: RelationshipType;
  phoneNumber: string;
  address: IAddress;
}

export type IUpdateParentDto = Partial<ICreateParentDto> &
  Partial<IUpdateUserDto>;

export interface IAddChildDto {
  childId: string;
}

export interface IRemoveChildDto {
  childId: string;
}
