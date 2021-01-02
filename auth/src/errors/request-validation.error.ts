import { ValidationError } from 'express-validator';
import CustomError from './custom-error.model';

export class RequestValidationError extends CustomError{

    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request');


        // Only because extending a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
        // ---
    }

    serializeErrors() {
        return this.errors.map(error => {
            return {message: error.msg, field: error.param};
        });
    }
}