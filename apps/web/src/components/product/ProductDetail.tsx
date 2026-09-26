import { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  DataList,
  Flex,
  Grid,
  IconButton,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  formatCrc,
  getPresentationLabel,
  type CatalogProduct,
} from '../../lib/api';
import { toTitleCase } from '../../lib/text';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600';

interface PageProps {
  readonly product: CatalogProduct;
}

export const ProductDetail = (props: PageProps) => {
  const { product } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasImages = product.images.length > 0;
  const lastIndex = product.images.length - 1;
  const currentIndex = hasImages ? Math.min(selectedIndex, lastIndex) : 0;
  const showControls = product.images.length > 1;

  const selectPrevious = () => setSelectedIndex((index) => Math.max(0, index - 1));
  const selectNext = () => setSelectedIndex((index) => Math.min(lastIndex, index + 1));

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6" w="full">
      <Box>
        <Box position="relative" w="full" maxW="md" mx="auto">
          <Image
            display="block"
            w="full"
            aspectRatio={1}
            objectFit="cover"
            rounded="sm"
            src={hasImages ? product.images[currentIndex].url : PLACEHOLDER_IMAGE}
            alt={
              hasImages
                ? `${toTitleCase(product.name)} — imagen ${currentIndex + 1} de ${product.images.length}`
                : toTitleCase(product.name)
            }
          />
          {showControls && (
            <>
              <IconButton
                aria-label="Imagen anterior"
                onClick={selectPrevious}
                disabled={currentIndex === 0}
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                size="sm"
                rounded="full"
                variant="surface"
              >
                <FaChevronLeft size={16} />
              </IconButton>
              <IconButton
                aria-label="Imagen siguiente"
                onClick={selectNext}
                disabled={currentIndex === lastIndex}
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
                size="sm"
                rounded="full"
                variant="surface"
              >
                <FaChevronRight size={16} />
              </IconButton>
            </>
          )}
        </Box>

        {showControls && (
          <Flex gap={2} mt={6} wrap="wrap" maxW="md" mx="auto">
            {product.images.map((image, index) => {
              const isActive = index === currentIndex;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="2xl"
                  px="0"
                  rounded="md"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  focusRingOffset="0"
                  focusRingWidth="3px"
                  borderWidth="1px"
                  borderColor={isActive ? 'gray.300' : 'transparent'}
                >
                  <Image src={image.url} alt="" boxSize="full" objectFit="cover" rounded="sm" />
                </Button>
              );
            })}
          </Flex>
        )}
      </Box>
      <Box>
        <Text textStyle="3xl" fontWeight="semibold" mt={2}>
          {toTitleCase(product.name)}
        </Text>
        {product.description && <Text color="gray.600" mt={2}>{product.description}</Text>}

        <Box mt={6}>
          <Text textStyle="lg" fontWeight="bold" mb={3}>
            Presentaciones
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {product.presentations.map((presentation) => (
              <DataList.Root key={presentation.id} orientation="horizontal" width="100%" mt={3}>
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
    </Grid>
  )
}
