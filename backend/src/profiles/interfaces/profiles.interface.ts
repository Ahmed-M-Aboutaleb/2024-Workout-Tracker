import { Types } from 'mongoose';

export interface IProfile {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  bio: string;
  userId: string;
  workoutsIds: string[];
  routinesIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
