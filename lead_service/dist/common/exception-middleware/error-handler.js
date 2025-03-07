"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerMiddleware = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '/app/dev.env' });
const environmentType = process.env.ENVIRONMENT_TYPE || '';
class ErrorHandlerMiddleware {
    static ErrorHandler(err, req, res, next) {
        console.log(err.stack, new Date());
        let serviceName = '';
        let errStatus = err.validationError && err.validationError.length > 0 ? 422 : err.status || 500;
        let message = err.validationError && err.validationError.length > 0 ? err.message || '' : err.message || 'Something went wrong';
        if (req.rawHeaders && req.rawHeaders.length > 2) {
            serviceName = req.rawHeaders[1];
        }
        console.log('ServiceName in Core package : ' + serviceName + '' + new Date());
        let response;
        if (environmentType == 'dev') {
            response = {
                message: message,
                status: errStatus,
                stack: err.stack,
                success: false,
                name: err.name,
                validationError: err.validationError,
            };
        }
        else {
            response = {
                message: message,
                status: errStatus,
                stack: 'An error has occurred. Please check your input parameter or contact your system administrator for assistance.',
                success: false,
                name: 'Api',
                validationError: err.validationError,
            };
        }
        res.status(errStatus).json(response);
    }
}
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;
