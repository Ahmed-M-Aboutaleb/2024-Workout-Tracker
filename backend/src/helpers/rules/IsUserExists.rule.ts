import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'IsUserExists', async: true })
@Injectable()
export class IsUserExistsRule implements ValidatorConstraintInterface {
  constructor(private userService: UsersService) {}

  async validate(payload: string, args: ValidationArguments) {
    const [shouldExist] = args.constraints;
    try {
      const user = await this.findUser(payload, args.property);
      return shouldExist ? !!user : !user;
    } catch (e) {
      return false;
    }
  }

  private async findUser(payload: string, property: string) {
    switch (property) {
      case 'username':
        return await this.userService.findOne({ username: payload });
      default:
        throw new Error(`Invalid property: ${property}`);
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [shouldExist] = args.constraints;
    return shouldExist ? 'User does not exist.' : 'User already exists.';
  }
}
