import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ValidatorErrorEnum } from '../utils/constant/validator/validatorErrorEnum.js';

export function IsAllowedDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAllowedDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => {
          return validateDate(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} ${ValidatorErrorEnum.Date}`;
        },
      },
    });
  };
}

export function IsDateGreaterThanOrEqualTo(comparisonProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThanOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [comparisonProperty],
      validator: {
        validate(value: any, args: ValidationArguments) {
          //if (!value) return true; // Allow undefined values

          const relatedValue = (args.object as any)[comparisonProperty];
          if (!relatedValue && !value) {
            return true;
          }

          if (validateDate(relatedValue) && validateDate(value)) {
            const dateValue = new Date(value);
            const relatedDateValue = new Date(relatedValue);
            return !isNaN(dateValue.getTime()) && !isNaN(relatedDateValue.getTime()) && dateValue >= relatedDateValue;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than or equal to ${args.constraints[0]}`;
        },
      },
    });
  };
}

export function validateDate(value: any) {
  // Define the allowed date formats
  const allowedFormats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, // YYYY-MM-DDTHH:mm:ss
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}$/, // YYYY-MM-DD HH:mm:ss.SSSSSS+HH
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+\+\d{2}$/, // YYYY-MM-DD HH:mm:ss.S+HH
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+\d{2}$/, // YYYY-MM-DD HH:mm:ss+HH
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // YYYY-MM-DD HH:mm:ss
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, // YYYY-MM-DDTHH:mm:ss.SSSZ
  ];

  // Check if the value matches any of the allowed formats
  for (const format of allowedFormats) {
    if (format.test(value)) {
      let date = new Date(value);
      if (isNaN(date.getTime())) {
        return false;
      }
      return true;
    }
  }
  return false;
}

export function IsDefinedIf(comparisonProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDefinedIf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [comparisonProperty],
      validator: {
        validate(value: any, args: ValidationArguments) {
          //if (!value) return true; // Allow undefined values

          const relatedValue = (args.object as any)[comparisonProperty];
          if ((value && !relatedValue) || (!value && relatedValue)) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `both ${args.property} and ${args.constraints[0]} should be null or valid date`;
        },
      },
    });
  };
}
