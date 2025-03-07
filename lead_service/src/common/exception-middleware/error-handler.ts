import { Request, Response, NextFunction } from 'express';
import { GenericHTTPError } from '../dtos/error-http-dto.js';
import { config } from 'dotenv';
config({ path: '/app/dev.env' });
const environmentType = process.env.ENVIRONMENT_TYPE || '';

export class ErrorHandlerMiddleware {
  static ErrorHandler(err: GenericHTTPError, req: Request, res: Response, next: NextFunction) {
    console.log(err.stack, new Date());
    let serviceName: string = '';
    let errStatus = err.validationError && err.validationError.length > 0 ? 422 : err.status || 500;
    let message =
      err.validationError && err.validationError.length > 0 ? err.message || '' : err.message || 'Something went wrong';
    if (req.rawHeaders && req.rawHeaders.length > 2) {
      serviceName = req.rawHeaders[1];
    }
    console.log('ServiceName in Core package : ' + serviceName + '' + new Date());

    let response: GenericHTTPError;
    if (environmentType == 'dev') {
      response = {
        message: message,
        status: errStatus,
        stack: err.stack,
        success: false,
        name: err.name,
        validationError: err.validationError,
      };
    } else {
      response = {
        message: message,
        status: errStatus,
        stack:
          'An error has occurred. Please check your input parameter or contact your system administrator for assistance.',
        success: false,
        name: 'Api',
        validationError: err.validationError,
      };
    }   
    res.status(errStatus).json(response);
  }
}
