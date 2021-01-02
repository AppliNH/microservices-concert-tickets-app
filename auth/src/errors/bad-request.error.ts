import CustomError from "./custom-error.model";

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super('Bad request: '+ message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}