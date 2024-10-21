import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProfileDto {
  @ApiProperty({
    example: 'Ahmed',
    description: 'The first name of the user',
    required: true,
    type: String,
  })
  @IsAlpha()
  firstName: string;
  @ApiProperty({
    example: 'Aboutaleb',
    description: 'The last name of the user',
    required: true,
    type: String,
  })
  @IsAlpha()
  lastName: string;
  @ApiProperty({
    example: 'I am a software engineer',
    description: 'The biography of the user',
    required: true,
    type: String,
  })
  @IsString()
  bio: string;
  @ApiProperty({
    example: '60f1b0b3b3f3b3b3b3f3b3b3',
    description: 'The unique identifier of the user',
    required: true,
    type: String,
  })
  @IsMongoId()
  userId: Types.ObjectId;
  @ApiProperty({
    example: ['60f1b0b3b3f3b3b3b3f3b3b3'],
    description: 'The workouts ids of the user',
    required: true,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  workoutsIds?: string[];
  @ApiProperty({
    example: ['60f1b0b3b3f3b3b3b3f3b3b3'],
    description: 'The routines ids of the user',
    required: true,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  routinesIds?: string[];
}
