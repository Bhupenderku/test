import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'match', async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const object = args.object as any;
    return confirmPassword === object[relatedPropertyName];
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}

export function Match(property: string) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'Passwords do not match' },
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
