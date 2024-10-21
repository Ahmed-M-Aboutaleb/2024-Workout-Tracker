import { Types } from 'mongoose';

export interface IProfilesFilters {
  _id?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  bio?: string;
  userId?: Types.ObjectId;
  createdAt?: string;
  updatedAt?: string;
}
