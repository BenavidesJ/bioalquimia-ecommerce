import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  DataList,
  Flex,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react'
import {
  fetchCatalogProduct,
  formatCrc,
  getPresentationLabel,
  type CatalogProduct,
} from '../lib/api'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const productId = Number(id)
  const invalidId = !Number.isInteger(productId) || productId <= 0

  useEffect(() => {
    if (invalidId) return undefined
    let cancelled = false
    fetchCatalogProduct(productId)
      .then((data) => {
        if (!cancelled) {
          setProduct(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [invalidId, productId])

  return (
    <Box minH="100svh" p={4}>
      <Button variant="outline" size="sm" onClick={() => navigate('/')} mb={4}>
        Volver
      </Button>

      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      {invalidId ? (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>Producto inválido</Alert.Title>
        </Alert.Root>
      ) : loading ? (
        <Flex justify="center" py={20}>
          <Spinner size="xl" />
        </Flex>
      ) : product ? (
        <Flex direction={{ base: 'column', md: 'row' }} gap={6} maxW="6xl">
          <Box>
            {product.images.length > 0 ? (
              <Image rounded="md" src={product.images[0].url} alt={product.name} />
            ) : (
              <Image rounded="md" src="https://placehold.co/100" alt="Placeholder" />
            )}
          </Box>

          <Box flex="1" minW={0}>
            <Flex align="center" gap={3} wrap="wrap">
              <Badge variant="solid" colorPalette="green">
                {product.category.name}
              </Badge>
              <Badge variant="subtle" colorPalette={product.inStock ? 'green' : 'red'}>
                {product.inStock ? 'Disponible' : 'Agotado'}
              </Badge>
            </Flex>
            <Text textStyle="3xl" fontWeight="bold" mt={2}>
              {product.name}
            </Text>
            {product.description && <Text color="gray.600" mt={2}>{product.description}</Text>}

            <Box mt={6}>
              <Text textStyle="lg" fontWeight="bold" mb={3}>
                Presentaciones
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {product.presentations.map((presentation) => (
                  <DataList.Root orientation="horizontal" width="100%" mt={3}>
                    <Text fontWeight="semibold">{getPresentationLabel(presentation)}</Text>
                    <DataList.Item>
                      <DataList.ItemLabel>Precio</DataList.ItemLabel>
                      <DataList.ItemValue>{formatCrc(presentation.priceCrc)}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Disponible</DataList.ItemLabel>
                      <DataList.ItemValue>{presentation.availableStock} uds</DataList.ItemValue>
                    </DataList.Item>
                    {presentation.attributes.length > 0 && (
                      <DataList.Item>
                        <DataList.ItemLabel>Atributos</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {presentation.attributes.map((attribute) => `${attribute.dimension}: ${attribute.value}`).join(', ')}
                        </DataList.ItemValue>
                      </DataList.Item>
                    )}
                  </DataList.Root>
                ))}
              </SimpleGrid>
            </Box>

            {product.hasAroma && (
              <Box mt={6}>
                <Text textStyle="lg" fontWeight="bold" mb={3}>
                  Aromas disponibles
                </Text>
                <Flex gap={2} wrap="wrap">
                  {product.aromas.map((aroma) => (
                    <Badge key={aroma.id} variant="outline" colorPalette="green">
                      {aroma.name}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>
      ) : null}
    </Box>
  )
}