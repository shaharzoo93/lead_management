"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAllowedDateFormat = IsAllowedDateFormat;
exports.IsDateGreaterThanOrEqualTo = IsDateGreaterThanOrEqualTo;
exports.validateDate = validateDate;
exports.IsDefinedIf = IsDefinedIf;
const class_validator_1 = require("class-validator");
const validatorErrorEnum_js_1 = require("../utils/constant/validator/validatorErrorEnum.js");
function IsAllowedDateFormat(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isAllowedDateFormat',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: (value) => {
                    return validateDate(value);
                },
                defaultMessage(args) {
                    return `${args.property} ${validatorErrorEnum_js_1.ValidatorErrorEnum.Date}`;
                },
            },
        });
    };
}
function IsDateGreaterThanOrEqualTo(comparisonProperty, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isDateGreaterThanOrEqualTo',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [comparisonProperty],
            validator: {
                validate(value, args) {
                    //if (!value) return true; // Allow undefined values
                    const relatedValue = args.object[comparisonProperty];
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
                defaultMessage(args) {
                    return `${args.property} must be greater than or equal to ${args.constraints[0]}`;
                },
            },
        });
    };
}
function validateDate(value) {
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
function IsDefinedIf(comparisonProperty, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isDefinedIf',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [comparisonProperty],
            validator: {
                validate(value, args) {
                    //if (!value) return true; // Allow undefined values
                    const relatedValue = args.object[comparisonProperty];
                    if ((value && !relatedValue) || (!value && relatedValue)) {
                        return false;
                    }
                    return true;
                },
                defaultMessage(args) {
                    return `both ${args.property} and ${args.constraints[0]} should be null or valid date`;
                },
            },
        });
    };
}
