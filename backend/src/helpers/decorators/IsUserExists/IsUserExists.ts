import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUserExistsRule } from '../../rules/IsUserExists.rule';

export function IsUserExists(
  shouldExist: boolean = false,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [shouldExist],
      validator: IsUserExistsRule,
    });
  };
}
