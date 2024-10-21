import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsUserExists } from 'src/helpers/decorators/IsUserExists/IsUserExists';

export class SignInDto {
  @ApiProperty({
    example: 'user',
    description: 'The username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsUserExists(true, { message: 'User not found' })
  username: string;
  @ApiProperty({
    example: 'password',
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
