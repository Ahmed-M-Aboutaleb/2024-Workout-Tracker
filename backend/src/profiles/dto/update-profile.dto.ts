import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({
    example: '2021-05-01T00:00:00.000Z',
    description: 'The date the user was created',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
