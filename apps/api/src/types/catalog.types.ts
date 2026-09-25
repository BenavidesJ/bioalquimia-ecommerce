export interface CatalogQueryParams {
  cursor?: string;
  limit?: number;
  category?: string;
  q?: string;
}

export interface CatalogImage {
  url: string;
}

export interface CatalogAroma {
  id: number;
  name: string;
}

export interface CatalogAttribute {
  dimension: string;
  value: string;
}

export interface CatalogPresentation {
  id: number;
  sku: string;
  unit: {
    code: string;
    name: string;
    symbol: string;
  };
  quantity: number;
  priceCrc: number;
  attributes: CatalogAttribute[];
  availableStock: number;
}

export interface CatalogProduct {
  id: number;
  name: string;
  parentSku: string;
  description: string;
  category: {
    id: number;
    name: string;
    skuPrefix: string;
  };
  images: CatalogImage[];
  aromas: CatalogAroma[];
  hasAroma: boolean;
  priceFrom: number | null;
  inStock: boolean;
  presentations: CatalogPresentation[];
}

export interface CatalogPage {
  items: CatalogProduct[];
  pagination: {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
}