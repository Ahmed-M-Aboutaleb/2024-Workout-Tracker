import { Types } from 'mongoose';

export interface IUsersFilters {
  _id?: Types.ObjectId;
  username?: string;
}
