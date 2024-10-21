import { Types } from 'mongoose';
import { Roles } from 'src/helpers/decorators/roles/roles.enum';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  passwordHash: string;
  role?: Roles;
  createdAt?: Date;
  updatedAt?: Date;
}
