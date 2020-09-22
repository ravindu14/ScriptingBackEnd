import * as express from "express";

import HttpException from "../exceptions/HttpException";

import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false
): express.RequestHandler {
  return ({ body }, response, next) => {
    validate(plainToClass(type, body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object["values"](error.constraints)
            )
            .join(", ");
          next(new HttpException(400, message));
        } else {
          next();
        }
      })
      .catch((e) => e);
  };
}

export default validationMiddleware;
