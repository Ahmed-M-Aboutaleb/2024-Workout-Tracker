import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUserExists } from 'src/helpers/decorators/IsUserExists/IsUserExists';

export class SignUpDto {
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
    example: 'username',
    description: 'The username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsUserExists(false, { message: 'User with this username already exists' })
  username: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'The password of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
