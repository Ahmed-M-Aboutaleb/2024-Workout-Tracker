import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { IProfile } from '../interfaces/profiles.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ collection: 'users', timestamps: true })
export class Profile implements IProfile {
  @ApiProperty({
    example: '60f1b0b3b3f3b3b3b3f3b3b3',
    description: 'The unique identifier of the profile',
    required: true,
    type: String,
  })
  _id: Types.ObjectId;
  @ApiProperty({
    example: 'Ahmed',
    description: 'The first name of the user',
    required: true,
    type: String,
  })
  @Prop({ required: true, type: String })
  firstName: string;
  @ApiProperty({
    example: 'Aboutaleb',
    description: 'The last name of the user',
    required: true,
    type: String,
  })
  @Prop({ required: true, type: String })
  lastName: string;
  @ApiProperty({
    example: 'I am a software engineer',
    description: 'The biography of the user',
    required: true,
    type: String,
  })
  @Prop({ required: false, type: String, default: '' })
  bio: string;
  @ApiProperty({
    example: '60f1b0b3b3f3b3b3b3f3b3b3',
    description: 'The unique identifier of the user',
    required: true,
    type: String,
  })
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;
  @ApiProperty({
    example: ['60f1b0b3b3f3b3b3b3f3b3b3'],
    description: 'The workouts ids of the user',
    required: false,
    type: [String],
  })
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Workouts',
    required: false,
    default: [],
  })
  workoutsIds: string[];
  @ApiProperty({
    example: ['60f1b0b3b3f3b3b3b3f3b3b3'],
    description: 'The routines ids of the user',
    required: false,
    type: [String],
  })
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Routines',
    required: false,
    default: [],
  })
  routinesIds: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
