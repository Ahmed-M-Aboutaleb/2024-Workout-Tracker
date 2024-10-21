import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Roles } from 'src/helpers/decorators/roles/roles.enum';
import { IUser } from '../interfaces/users.interface';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User implements IUser {
  @ApiProperty({
    example: '60f1b0b3b3f3b3b3b3f3b3b3',
    description: 'The unique identifier of the user',
    required: true,
    type: String,
  })
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @ApiProperty({
    example: 'iifire',
    description: 'The username of the user',
    required: true,
    type: String,
  })
  @Prop({ required: true, type: String, unique: true })
  username: string;

  @ApiProperty({
    example: 'iifire@password',
    description: 'The password hash of the user',
    required: true,
    type: String,
  })
  @Prop({ required: true, type: String })
  passwordHash: string;

  @ApiProperty({
    example: Roles.USER,
    description: 'The role of the user',
    required: true,
    type: String,
    enum: Roles,
  })
  @Prop({ type: String, enum: Roles, default: Roles.USER })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
