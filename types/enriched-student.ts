import type { IStudent } from "./student/index";

// Extended type for enriched student data with name and email
export type IStudentWithUserData = IStudent & { 
  _id?: string; 
  name?: string; 
  email?: string; 
};
