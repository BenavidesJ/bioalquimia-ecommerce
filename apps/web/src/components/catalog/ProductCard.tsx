import { Button, Card, Image, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
  type CatalogProduct,
} from '../../lib/api'

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <Card.Root maxW="sm" overflow="hidden" width="100%">
      {product.images.length > 0 ? (
        <Card.Body p={0}>
          <Image rounded="md" src="https://i.pravatar.cc/300?img=4" alt="John Doe" />
        </Card.Body>
      ) : (
        <Card.Body p={0}>
          <Image rounded="md" src="https://placehold.co/100" alt="Placeholder" />
        </Card.Body>
      )}
      <Card.Body gap="2">
        <Card.Title>{product.name}</Card.Title>
        <Text textStyle="sm" color={product.inStock ? 'green.600' : 'red.400'} fontWeight="semibold">
          {product.inStock ? 'Disponible' : 'Agotado'}
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline" size="sm" onClick={() => navigate(`/catalogo/${product.id}`)}>
          Ver detalle
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}