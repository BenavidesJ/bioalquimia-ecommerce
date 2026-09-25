import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const ajv = new Ajv({ allErrors: true, removeAdditional: true, coerceTypes: true });
addFormats(ajv);
addKeywords(ajv);

interface ValidationError {
  field: string;
  message?: string;
}

export const validateRequest = <T, Q = unknown>(
  schema?: JSONSchemaType<T>,
  querySchema?: JSONSchemaType<Q>,
) => {
  const validateBody = schema ? ajv.compile(schema) : null;
  const validateQuery = querySchema ? ajv.compile(querySchema) : null;

  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];

    if (validateBody) {
      const valid = validateBody(req.body);
      if (!valid) {
        validateBody.errors?.forEach((err) => {
          errors.push({ field: err.instancePath.replace('/', ''), message: err.message });
        });
      }
    }

    if (validateQuery) {
      const valid = validateQuery(req.query);
      if (!valid) {
        validateQuery.errors?.forEach((err) => {
          errors.push({ field: `query${err.instancePath.replace('/', '')}`, message: err.message });
        });
      }
    }

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
};