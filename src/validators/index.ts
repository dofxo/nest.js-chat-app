import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    const password = object.password; // Access the password field
    return confirmPassword === password; // Compare confirmPassword with password
  }

  defaultMessage(args: ValidationArguments) {
    return "رمز عبور با تاییدیه مطابقت ندارد"; // Custom error message
  }
}
