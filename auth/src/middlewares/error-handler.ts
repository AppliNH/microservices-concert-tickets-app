import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error.model";
import { DatabaseConnectionError } from "../errors/database-connection.error";
import { RequestValidationError } from "../errors/request-validation.error";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
    ) => {

        if (err instanceof CustomError) {
            console.warn(err);
            return res.status(err.statusCode).send({errors: err.serializeErrors()})        
        }

        console.warn("Unknown error: ", err)
        res.status(400).send({
            errors: [{ message: 'Something went wrong' }]
        });

};