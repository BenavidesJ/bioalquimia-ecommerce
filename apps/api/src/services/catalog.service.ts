import { col, fn, Op, WhereOptions } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/appError';
import {
  Aroma,
  Category,
  InventoryMovement,
  Presentation,
  Product,
  ProductImage,
  Unit,
  VariantDimension,
  VariantDimensionValue,
} from '../models';
import {
  CatalogPage,
  CatalogProduct,
  CatalogQueryParams,
} from '../types/catalog.types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MIN_LIMIT = 1;

const encodeCursor = (id: number): string => Buffer.from(String(id)).toString('base64');

const decodeCursor = (cursor?: string): number | null => {
  if (!cursor) return null;
  const raw = Buffer.from(cursor, 'base64').toString('utf8');
  const id = parseInt(raw, 10);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('cursor inválido', StatusCodes.BAD_REQUEST);
  }
  return id;
};

const buildFilters = async (
  category?: string,
  q?: string,
): Promise<WhereOptions<Product>> => {
  const clauses: WhereOptions<Product>[] = [{ isActive: true }];

  if (category) {
    const numeric = parseInt(category, 10);
    let match: Category | null = null;
    if (Number.isInteger(numeric) && numeric > 0) {
      match = await Category.findByPk(numeric);
    } else {
      match = await Category.findOne({
        where: {
          [Op.or]: [
            { skuPrefix: { [Op.iLike]: category.trim() } },
            { name: { [Op.iLike]: category.trim() } },
          ],
        },
      });
    }
    clauses.push({ categoryId: match ? match.id : 0 });
  }

  if (q?.trim()) {
    const term = `%${q.trim()}%`;
    clauses.push({
      [Op.or]: [{ name: { [Op.iLike]: term } }, { description: { [Op.iLike]: term } }],
    } as WhereOptions<Product>);
  }

  return { [Op.and]: clauses };
};

const isActivePresentation = (presentation: Presentation): boolean => presentation.isActive;

const CATALOG_INCLUDES = [
  { model: Category, as: 'category' },
  { model: ProductImage, as: 'images' },
  { model: Aroma, as: 'aromas' },
  {
    model: Presentation,
    as: 'presentations',
    include: [
      { model: Unit, as: 'unit' },
      {
        model: VariantDimensionValue,
        as: 'dimensionValues',
        include: [{ model: VariantDimension, as: 'dimension' }],
      },
    ],
  },
];

const toPresentationDto = (
  presentation: Presentation,
  availableStock: number,
): CatalogProduct['presentations'][number] => ({
  id: presentation.id,
  sku: presentation.sku,
  unit: {
    code: presentation.unit.code,
    name: presentation.unit.name,
    symbol: presentation.unit.symbol,
  },
  quantity: Number(presentation.quantity),
  priceCrc: Number(presentation.priceCrc),
  attributes: [...presentation.dimensionValues]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    .map((dimensionValue: VariantDimensionValue) => ({
      dimension: dimensionValue.dimension?.code ?? '?',
      value: dimensionValue.value,
    })),
  availableStock,
});

const loadStockByPresentation = async (
  presentationIds: number[],
): Promise<Map<number, number>> => {
  const stockByPresentation = new Map<number, number>();
  if (presentationIds.length === 0) return stockByPresentation;

  const movements = (await InventoryMovement.findAll({
    attributes: ['presentationId', [fn('SUM', col('qty_delta')), 'stock']],
    where: { presentationId: { [Op.in]: presentationIds } },
    group: ['presentationId'],
    raw: true,
  })) as unknown as Array<{ presentationId: number; stock: string }>;
  for (const movement of movements) {
    stockByPresentation.set(movement.presentationId, Number(movement.stock));
  }
  return stockByPresentation;
};

const buildProductDto = (
  product: Product,
  stockByPresentation: Map<number, number>,
): CatalogProduct | null => {
  const presentations = product.presentations
    .filter(isActivePresentation)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    .map((presentation) => toPresentationDto(presentation, stockByPresentation.get(presentation.id) ?? 0));
  if (presentations.length === 0) return null;

  return {
    id: product.id,
    name: product.name,
    parentSku: product.parentSku,
    description: product.description,
    category: {
      id: product.category.id,
      name: product.category.name,
      skuPrefix: product.category.skuPrefix,
    },
    images: product.images.map((image: ProductImage) => ({ url: image.url })),
    aromas: product.aromas.map((aroma: Aroma) => ({ id: aroma.id, name: aroma.name })),
    hasAroma: product.aromas.length > 0,
    priceFrom: Math.min(...presentations.map((presentation) => presentation.priceCrc)),
    inStock: presentations.some((presentation) => presentation.availableStock > 0),
    presentations,
  };
};

export class CatalogService {
  public async getCatalog(params: CatalogQueryParams): Promise<CatalogPage> {
    const limit = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, MIN_LIMIT), MAX_LIMIT);
    const cursorId = decodeCursor(params.cursor);
    const where = await buildFilters(params.category, params.q);

    const pageRows = await Product.findAll({
      where: cursorId !== null ? { ...where, id: { [Op.gt]: cursorId } } : where,
      attributes: ['id'],
      order: [['id', 'ASC']],
      limit: limit + 1,
    });

    const hasMore = pageRows.length > limit;
    const pageIds = (hasMore ? pageRows.slice(0, limit) : pageRows).map((row) => row.id);
    if (pageIds.length === 0) {
      return {
        items: [],
        pagination: { limit, nextCursor: null, hasMore: false },
      };
    }

    const products = await Product.findAll({
      where: { id: { [Op.in]: pageIds } },
      include: CATALOG_INCLUDES,
    });

    const presentationIds = products.flatMap((product) =>
      product.presentations.map((presentation) => presentation.id),
    );
    const stockByPresentation = await loadStockByPresentation(presentationIds);

    const positionByProductId = new Map(pageIds.map((id, index) => [id, index]));
    const items = products
      .map((product) => buildProductDto(product, stockByPresentation))
      .filter((product): product is CatalogProduct => product !== null)
      .sort((a, b) => (positionByProductId.get(a.id) ?? 0) - (positionByProductId.get(b.id) ?? 0));

    const lastId = items.length > 0 ? items[items.length - 1].id : null;

    return {
      items,
      pagination: {
        limit,
        nextCursor: hasMore && lastId !== null ? encodeCursor(lastId) : null,
        hasMore,
      },
    };
  }

  public async getProductById(id: number): Promise<CatalogProduct> {
    const product = await Product.findOne({
      where: { id, isActive: true },
      include: CATALOG_INCLUDES,
    });
    if (!product) {
      throw new AppError('Producto no encontrado', StatusCodes.NOT_FOUND);
    }

    const presentationIds = product.presentations.map((presentation) => presentation.id);
    const stockByPresentation = await loadStockByPresentation(presentationIds);

    const dto = buildProductDto(product, stockByPresentation);
    if (!dto) {
      throw new AppError('Producto no encontrado', StatusCodes.NOT_FOUND);
    }
    return dto;
  }
}