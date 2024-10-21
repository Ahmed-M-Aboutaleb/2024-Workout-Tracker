import { Types } from 'mongoose';
import { Roles } from 'src/helpers/decorators/roles/roles.enum';

export interface TokenPayload {
  username: string;
  userId: Types.ObjectId;
  role: Roles;
}
