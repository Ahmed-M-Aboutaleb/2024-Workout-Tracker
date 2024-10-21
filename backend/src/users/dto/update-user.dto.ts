import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: '2021-05-01T00:00:00.000Z',
    description: 'The date the user was created',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
