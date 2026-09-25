export interface CatalogAttribute {
  dimension: string
  value: string
}

export interface CatalogPresentation {
  id: number
  sku: string
  unit: {
    code: string
    name: string
    symbol: string
  }
  quantity: number
  priceCrc: number
  attributes: CatalogAttribute[]
  availableStock: number
}

export interface CatalogProduct {
  id: number
  name: string
  parentSku: string
  description: string
  category: {
    id: number
    name: string
    skuPrefix: string
  }
  images: Array<{ url: string }>
  aromas: Array<{ id: number; name: string }>
  hasAroma: boolean
  priceFrom: number | null
  inStock: boolean
  presentations: CatalogPresentation[]
}

export interface CatalogPage {
  items: CatalogProduct[]
  pagination: {
    limit: number
    nextCursor: string | null
    hasMore: boolean
  }
}

export interface CatalogParams {
  category?: string
  cursor?: string
  limit?: number
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function fetchCatalog(params: CatalogParams = {}): Promise<CatalogPage> {
  const search = new URLSearchParams()
  if (params.category) search.set('category', params.category)
  if (params.cursor) search.set('cursor', params.cursor)
  if (params.limit) search.set('limit', String(params.limit))
  const query = search.toString()
  const url = `${API_BASE}/api/catalog${query ? `?${query}` : ''}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Error al obtener el catálogo (${res.status})`)
  }
  const body = await res.json()
  return body.data
}

export async function fetchCatalogProduct(id: number): Promise<CatalogProduct> {
  const res = await fetch(`${API_BASE}/api/catalog/${id}`)
  if (!res.ok) {
    throw new Error(`Error al obtener el producto (${res.status})`)
  }
  const body = await res.json()
  return body.data
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

export function formatCrc(value: number): string {
  return CURRENCY_FORMATTER.format(value)
}

export function getPresentationLabel(presentation: CatalogPresentation): string {
  const parts: string[] = []
  const quantity = presentation.quantity
  const unitName = presentation.unit.name || presentation.unit.symbol
  if (quantity === 1) {
    parts.push(unitName)
  } else if (quantity === 0.5) {
    parts.push(`1/2 ${unitName}`)
  } else {
    parts.push(`${quantity} ${unitName}`)
  }
  for (const attribute of presentation.attributes) {
    parts.push(attribute.value)
  }
  return parts.join(' · ')
}