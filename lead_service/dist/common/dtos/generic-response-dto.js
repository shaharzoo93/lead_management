"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericResponse = void 0;
class GenericResponse {
    status;
    data;
    error = '';
    code;
    validationError = [];
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.GenericResponse = GenericResponse;
