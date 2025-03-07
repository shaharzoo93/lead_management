"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onActionExecution = onActionExecution;
exports.validationRequest = validationRequest;
exports.ValidateProperty = ValidateProperty;
exports.validateDateFormat = validateDateFormat;
exports.MQTTValidator = MQTTValidator;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const requestValidatorDataTypeEnum_js_1 = require("../utils/constant/validator/requestValidatorDataTypeEnum.js");
const commonHelper_js_1 = require("../utils/commonHelper.js");
const generic_response_dto_js_1 = require("../dtos/generic-response-dto.js");
const validatorErrorEnum_js_1 = require("../utils/constant/validator/validatorErrorEnum.js");
const dateValidator_js_1 = require("./dateValidator.js");
const inputValidator = ['<', '>', 'script', 'http'];
const stringValidatorRegex = /^[a-zA-Z0-9 ,.:@&+_\/\\-]+$/;
function onActionExecution() {
    return async (req, res, next) => {
        for (var propName in req.params) {
            if (req.params[propName]) {
                req.params[propName] = req.params[propName].trim();
            }
        }
        next();
    };
}
function validationRequest(dtoClass) {
    return async (req, res, next) => {
        const result = new generic_response_dto_js_1.GenericResponse();
        result.code = 422;
        result.status = false;
        // Transform request body into DTO instance
        req.body = await trimRequestBody(req.body);
        const output = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        try {
            if (Array.isArray(output)) {
                await Promise.all(output.map((d) => (0, class_validator_1.validateOrReject)(d, { skipMissingProperties: true, whitelist: true })));
            }
            else {
                await (0, class_validator_1.validateOrReject)(output, { skipMissingProperties: true, whitelist: true });
            }
            //Validate unauthorized code
            let [isAuthorized, authorizedErrors] = await validateUnAuthorizeCode(req.body);
            if (!isAuthorized) {
                result.validationError = authorizedErrors;
                res.status(422);
                res.send(commonHelper_js_1.CommonHelper.GetResponseByResponseType(req.params.responseType, result));
                return;
            }
            // Validation passed
            res.locals.input = output;
            next();
        }
        catch (errors) {
            // Validation failed
            const validationErrors = errors;
            const errorTexts = [];
            for (const error of validationErrors) {
                if (error.constraints) {
                    errorTexts.push(error.constraints);
                }
                else if (error.children && error.children.length > 0) {
                    // Handle nested errors
                    const nestedErrors = processNestedErrors(error.children);
                    errorTexts.push(...nestedErrors);
                }
            }
            result.validationError = errorTexts;
            res
                .status(422)
                .send(commonHelper_js_1.CommonHelper.GetResponseByResponseType(req.params.responseType, result));
        }
    };
}
async function trimRequestBody(obj) {
    function trimObject(value) {
        if (Array.isArray(value)) {
            // Recursively trim each item in the array
            return value.map((item) => trimObject(item));
        }
        else if (typeof value === 'object' && value !== null) {
            // Recursively trim each property in the object
            const trimmedObj = {};
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    trimmedObj[key] = trimObject(value[key]);
                }
            }
            return trimmedObj;
        }
        else if (typeof value === 'string') {
            return value.trim();
        }
        else {
            // Return non-string values
            return value;
        }
    }
    return trimObject(obj);
}
function processNestedErrors(errors) {
    const errorTexts = [];
    for (const error of errors) {
        if (error.constraints) {
            errorTexts.push(error.constraints);
        }
        else if (error.children && error.children.length > 0) {
            // Recursively handle deeper nested errors
            const nestedErrors = processNestedErrors(error.children);
            errorTexts.push(...nestedErrors);
        }
    }
    return errorTexts;
}
async function validateUnAuthorizeCode(body) {
    let errors = [];
    function validateObject(obj, parentKey, key) {
        if (Array.isArray(obj)) {
            // Validate each item in the array
            for (let i = 0; i < obj.length; i++) {
                const arrayItem = obj[i];
                if (typeof arrayItem == 'object') {
                    if (parentKey != null && parentKey != undefined) {
                        validateObject(arrayItem, `${parentKey}[${i}]`);
                    }
                    else {
                        validateObject(arrayItem, `[${i}]`);
                    }
                }
                else if (typeof arrayItem === 'string') {
                    // Validate string values against patterns
                    let value = arrayItem;
                    const trimmedValue = value.trim();
                    if (trimmedValue !== '') {
                        if (inputValidator.some((pattern) => JSON.stringify(value).toLowerCase().includes(pattern)) ||
                            !stringValidatorRegex.test(value)) {
                            errors.push({ [key]: `${key} is not a valid input` });
                        }
                    }
                    else {
                        errors.push({ [key]: `${key} must not be empty` });
                    }
                }
                else if (typeof arrayItem !== 'string') {
                    let value = arrayItem;
                    // Validate non string values against patterns
                    if (inputValidator.some((pattern) => JSON.stringify(value).toLowerCase().includes(pattern))) {
                        errors.push({ [key]: `${key} is not a valid input` });
                    }
                }
            }
        }
        else {
            // Validate object properties recursively
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
                    if (typeof value === 'object' && value !== null) {
                        validateObject(value, fullKey, key);
                    }
                    else if (typeof value === 'string') {
                        // Validate string values against patterns
                        const trimmedValue = value.trim();
                        if (trimmedValue !== '') {
                            if (inputValidator.some((pattern) => JSON.stringify(value).toLowerCase().includes(pattern)) ||
                                !stringValidatorRegex.test(value)) {
                                errors.push({ [fullKey]: `${fullKey} is not a valid input` });
                            }
                        }
                        else {
                            errors.push({ [fullKey]: `${fullKey} must not be empty` });
                        }
                    }
                    else if (typeof value !== 'string') {
                        // Validate non string values against patterns
                        if (inputValidator.some((pattern) => JSON.stringify(value).toLowerCase().includes(pattern))) {
                            errors.push({ [fullKey]: `${fullKey} is not a valid input` });
                        }
                    }
                }
            }
        }
    }
    validateObject(body);
    return [errors.length === 0, errors];
}
async function ValidateProperty(configs) {
    const errorMessages = [];
    const integerRegex = /^[-+]?\d+$/;
    const floatRegex = /^[-+]?\d+(\.\d+)?$/;
    configs.forEach(({ propertyName, value, type, isOptional, comparisonFromDateProperty, comparisonFromDatePropertyValue }) => {
        if (!isOptional && (value == undefined || value == null || value == '')) {
            errorMessages.push({ [propertyName]: `${propertyName} is required` });
            return;
        }
        if (inputValidator.some((pattern) => String(value).toLowerCase().includes(pattern))) {
            errorMessages.push({ [propertyName]: `${propertyName} is not a valid input` });
            return;
        }
        if (value != undefined && value != null) {
            if (value == 'undefined' || value == 'null' || value == '') {
                errorMessages.push({ [propertyName]: `${propertyName} is not valid` });
                return;
            }
            switch (type) {
                case requestValidatorDataTypeEnum_js_1.ValidatorDataTypeEnum.String:
                    if (typeof value !== 'string' || !stringValidatorRegex.test(value)) {
                        errorMessages.push({ [propertyName]: `${propertyName} is not valid` });
                    }
                    break;
                case requestValidatorDataTypeEnum_js_1.ValidatorDataTypeEnum.Number:
                    if (!integerRegex.test(value)) {
                        errorMessages.push({ [propertyName]: `${propertyName} must be a valid number` });
                    }
                    break;
                case requestValidatorDataTypeEnum_js_1.ValidatorDataTypeEnum.Float:
                    if (!floatRegex.test(value)) {
                        errorMessages.push({ [propertyName]: `${propertyName} must be a float/decimal number` });
                    }
                    break;
                case requestValidatorDataTypeEnum_js_1.ValidatorDataTypeEnum.Date:
                    const dateError = validateDateFormat(value, propertyName);
                    if (dateError) {
                        errorMessages.push({ [propertyName]: dateError });
                    }
                    break;
                case requestValidatorDataTypeEnum_js_1.ValidatorDataTypeEnum.Boolean:
                    if (value.toLowerCase() !== 'true' &&
                        value.toLowerCase() !== 'false' &&
                        value.toLowerCase() !== true &&
                        value.toLowerCase() !== false) {
                        errorMessages.push({ [propertyName]: `${propertyName} must be a boolean (true/false)` });
                    }
                    break;
                default:
                    errorMessages.push({ [propertyName]: `Unknown type for ${propertyName}` });
            }
        }
        if (comparisonFromDateProperty && comparisonFromDatePropertyValue) {
            const relatedDateError = validateDateFormat(comparisonFromDatePropertyValue, comparisonFromDateProperty);
            if (relatedDateError == null) {
                const parsedDate = new Date(value);
                const relatedDateValue = new Date(comparisonFromDatePropertyValue);
                if (!isNaN(parsedDate.getTime()) && !isNaN(relatedDateValue.getTime())) {
                    if (parsedDate < relatedDateValue) {
                        errorMessages.push({
                            [propertyName]: `${propertyName} must be greater than or equal to ${comparisonFromDateProperty}`,
                        });
                    }
                }
            }
        }
    });
    return [errorMessages.length == 0, errorMessages];
}
function validateDateFormat(value, propertyName) {
    const datePatterns = [
        /^\d{4}-\d{2}-\d{2}$/,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}$/,
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+\+\d{2}$/,
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+\d{2}$/,
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    ];
    const isValidFormat = datePatterns.some((pattern) => pattern.test(value));
    const parsedDate = new Date(value);
    if (!isValidFormat || isNaN(parsedDate.getTime())) {
        return `${propertyName} ${validatorErrorEnum_js_1.ValidatorErrorEnum.Date}`;
    }
    return null;
}
async function MQTTValidator(topic, value, timestamp) {
    let errors = [];
    if (value !== 'undefined' && value !== undefined) {
        let trimmedValue = 'null';
        if (value !== null && value !== '') {
            trimmedValue = value.toString().trim();
        }
        if (inputValidator.some((pattern) => trimmedValue.toLowerCase().includes(pattern)) ||
            !stringValidatorRegex.test(trimmedValue)) {
            errors.push(`${value} is not a valid value`);
        }
    }
    else {
        errors.push(`value must not be empty`);
    }
    if (topic !== '') {
        let trimmedTopic = topic.trim().replace(/\uFEFF/g, '');
        if (inputValidator.some((pattern) => trimmedTopic.toLowerCase().includes(pattern)) ||
            !stringValidatorRegex.test(trimmedTopic)) {
            errors.push(`${trimmedTopic} is not a valid topic`);
        }
    }
    else {
        errors.push(`topic must not be empty`);
    }
    if (timestamp !== '' &&
        timestamp !== 'undefined' &&
        timestamp !== 'null' &&
        timestamp !== null &&
        timestamp !== undefined) {
        let dateTime;
        if (timestamp.toString().length === 10) {
            dateTime = new Date(Number(timestamp) * 1000).toISOString();
        }
        else {
            dateTime = new Date(Number(timestamp)).toISOString();
        }
        if (!(0, dateValidator_js_1.validateDate)(dateTime)) {
            errors.push(`${timestamp} is not a valid timestamp (${dateTime})`);
        }
    }
    return [errors.length == 0, errors];
}
