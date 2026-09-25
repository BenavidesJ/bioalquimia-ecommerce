import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { CatalogFilters, type CatalogFiltersState } from '../components/catalog/CatalogFilters'
import { ProductCard } from '../components/catalog/ProductCard'
import { fetchCatalog, type CatalogPage, type CatalogParams } from '../lib/api'

const PAGE_SIZE = 12

function buildParams(filters: CatalogFiltersState, cursor?: string): CatalogParams {
  const params: CatalogParams = { limit: PAGE_SIZE }
  if (filters.categories.length === 1) {
    params.category = filters.categories[0]
  }
  if (cursor) {
    params.cursor = cursor
  }
  return params
}

export function LandingPage() {
  const [filters, setFilters] = useState<CatalogFiltersState>({ categories: [] })
  const [cursorStack, setCursorStack] = useState<string[]>([])
  const [data, setData] = useState<CatalogPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentCursor = cursorStack.length > 0 ? cursorStack[cursorStack.length - 1] : undefined

  useEffect(() => {
    let cancelled = false
    fetchCatalog(buildParams(filters, currentCursor))
      .then((page) => {
        if (!cancelled) {
          setData(page)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar el catálogo')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filters, currentCursor])

  const handleFiltersChange = useCallback((next: CatalogFiltersState) => {
    setFilters(next)
    setCursorStack([])
  }, [])

  const goToNextPage = () => {
    if (!data?.pagination.nextCursor) return
    setCursorStack((stack) => [...stack, data.pagination.nextCursor as string])
  }

  const goToPreviousPage = () => {
    setCursorStack((stack) => stack.slice(0, -1))
  }

  const pageNumber = cursorStack.length + 1

  return (
    <Flex minH="100svh">
      <CatalogFilters filters={filters} onChange={handleFiltersChange} />
      <Box flex="1" minW={0} p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Text textStyle="3xl" fontWeight="bold">
              Bioalquimia
            </Text>
            <Text color="gray.600">Catálogo de productos</Text>
          </Box>
        </Flex>

        {error && (
          <Alert.Root status="error" mb={4}>
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        {loading ? (
          <Flex justify="center" py={20}>
            <Spinner size="xl" />
          </Flex>
        ) : data && data.items.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 3 }} gap={4}>
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </SimpleGrid>

            <Flex justify="flex-end" align="center" gap={3} mt={6}>
              <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={cursorStack.length === 0}>
                Anterior
              </Button>
              <Text textStyle="sm" color="gray.600">
                Página {pageNumber}
              </Text>
              <Button variant="solid" size="sm" onClick={goToNextPage} disabled={!data.pagination.hasMore}>
                Siguiente
              </Button>
            </Flex>
          </>
        ) : (
          <Box textAlign="center" py={20}>
            <Text color="gray.500">No hay productos para mostrar</Text>
          </Box>
        )}
      </Box>
    </Flex>
  )
}