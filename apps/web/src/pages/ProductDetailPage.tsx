import { createElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Container,
  Flex,
} from '@chakra-ui/react';
import { CarFront, FlaskConical, House, type LucideIcon } from 'lucide-react';
import {
  fetchCatalogProduct,
  type CatalogProduct,
} from '../lib/api';
import { toTitleCase } from '../lib/text';
import {
  AlertComponent,
  Breadcrumb,
  ProductDetail,
  SkeletonComponent,
  SkeletonTextComponent,
} from '../components';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  HOG: House,
  AUT: CarFront,
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
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
    <Container>
      {error && (
        <AlertComponent status="error" title={error} icon={<Alert.Indicator />} />
      )}

      {invalidId ? (
        <AlertComponent status="error" title="Producto inválido" />
      ) : loading ? (
        <Flex direction={{ base: 'column', md: 'row' }} gap={6} mt={4}>
          <SkeletonComponent height="5rem" flex={{ base: '1', md: '0 0 33%' }} />
          <Box flex="1">
            <SkeletonComponent height="1.5rem" width="40%" />
            <SkeletonTextComponent noOfLines={4} />
          </Box>
        </Flex>
      ) : product ? (
        <>
          <Breadcrumb
            size={{ base: "md", lg: "lg" }}
            items={[
              { label: 'Catálogo', href: '/', icon: <FlaskConical size="1em" /> },
              {
                label: product.category.name,
                icon: createElement(CATEGORY_ICONS[product.category.skuPrefix], { size: '1em' }),
              },
              { label: toTitleCase(product.name) },
            ]}
          />
          {/* ==================================================================
              DATOS DE EJEMPLO PARA PROBAR LA GALERÍA — BORRAR ESTE BLOQUE
              Pega 8 imágenes distintas para ver la base, las flechas y la fila
              de miniaturas. Al borrar este bloque, <ProductDetail /> vuelve a
              usar las imágenes reales del API.
              Para probar otras ramas: dejá 1 sola entrada (oculta flechas y
              miniaturas) o images: [] (muestra el placeholder).
              ================================================================== */}
          <ProductDetail
            product={{
              ...product,
              images: [
                { url: 'https://placehold.co/600/1e40af/white?text=Imagen+1' },
                { url: 'https://placehold.co/600/0f766e/white?text=Imagen+2' },
                { url: 'https://placehold.co/600/b45309/white?text=Imagen+3' },
                { url: 'https://placehold.co/600/7e22ce/white?text=Imagen+4' },
                { url: 'https://placehold.co/600/be123c/white?text=Imagen+5' },
                { url: 'https://placehold.co/600/15803d/white?text=Imagen+6' },
                { url: 'https://placehold.co/600/0369a1/white?text=Imagen+7' },
                { url: 'https://placehold.co/600/a16207/white?text=Imagen+8' },
              ],
            }}
          />
          {/* ==================================================================
              FIN DEL BLOQUE DE DATOS DE EJEMPLO
              ================================================================== */}
        </>
      ) : null}
    </Container>
  )
}