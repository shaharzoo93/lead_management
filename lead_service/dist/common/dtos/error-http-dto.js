"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericHTTPError = void 0;
class GenericHTTPError extends Error {
    status;
    success;
    message;
    stack;
    validationError = [];
    constructor(code, message) {
        super();
        Error.captureStackTrace(this);
        this.status = code || 500;
        this.message = message || '';
        this.success = false;
    }
}
exports.GenericHTTPError = GenericHTTPError;
