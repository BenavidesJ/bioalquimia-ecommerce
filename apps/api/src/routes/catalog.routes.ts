import { JSONSchemaType } from 'ajv';
import { Router } from 'express';
import { CatalogController } from '../controllers';
import { validateRequest } from '../middleware/validateRequest';
import { CatalogQueryParams } from '../types/catalog.types';

const catalogQuerySchema: JSONSchemaType<CatalogQueryParams> = {
  type: 'object',
  properties: {
    cursor: { type: 'string', minLength: 1, nullable: true },
    limit: { type: 'integer', minimum: 1, maximum: 50, nullable: true },
    category: { type: 'string', minLength: 1, nullable: true },
    q: { type: 'string', maxLength: 200, nullable: true },
  },
  additionalProperties: false,
};

const router = Router();
const catalogController = new CatalogController();

router.get('/', validateRequest(undefined, catalogQuerySchema), catalogController.getCatalog);
router.get('/:id', catalogController.getProduct);

export default router;