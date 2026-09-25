import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CatalogService } from '../services/catalog.service';
import { CatalogQueryParams } from '../types/catalog.types';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../utils/appError';

const catalogService = new CatalogService();

const parseProductId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id de producto inválido', StatusCodes.BAD_REQUEST);
  }
  return id;
};

export class CatalogController {
  public getCatalog = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params: CatalogQueryParams = req.query as unknown as CatalogQueryParams;
      const page = await catalogService.getCatalog(params);
      ApiResponse.success(res, page, 'Catálogo obtenido');
    } catch (error) {
      next(error);
    }
  };

  public getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const product = await catalogService.getProductById(parseProductId(req.params.id as string));
      ApiResponse.success(res, product, 'Producto obtenido');
    } catch (error) {
      next(error);
    }
  };
}