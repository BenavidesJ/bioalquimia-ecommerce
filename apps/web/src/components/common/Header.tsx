import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Tooltip,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { FaHeart, FaSearch, FaShoppingCart } from "react-icons/fa";
import { BrandLogo } from "./BrandLogo";

/** Única ruta que muestra la barra de búsqueda: el catálogo. */
export const CATALOG_PATH = "/";

export interface HeaderProps {
  /**
   * Feature flag del botón de carrito. El API no tiene carrito todavía.
   * @default false
   */
  readonly showCart?: boolean;
  /**
   * Feature flag del botón de favoritos. El API no tiene favoritos todavía.
   * @default false
   */
  readonly showFavorites?: boolean;
  /** Se dispara en cada cambio de la barra de búsqueda. */
  readonly onSearch?: (query: string) => void;
  readonly placeholder?: string;
}

function HeaderAction({ label, icon: Icon }: { label: string; icon: IconType }) {
  return (
    <Tooltip.Root openDelay={300}>
      <Tooltip.Trigger asChild>
        <IconButton
          aria-label={label}
          variant="ghost"
          color="gray.700"
          _hover={{ bg: "gray.100", color: "#0058C6" }}
        >
          <Icon size={20} />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>{label}</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}

export function Header({
  showCart = false,
  showFavorites = false,
  onSearch,
  placeholder = "Buscar productos",
}: HeaderProps) {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  const showSearch = pathname === CATALOG_PATH;
  const hasActions = showCart || showFavorites;

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="white"
      borderBottomWidth="1px"
      borderColor="border.subtle"
    >
      <Container maxW="container.xl" py={3}>
        <Flex align="center" gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
          <Box order={1}>
            <Link to={CATALOG_PATH} aria-label="BioAlquimia - Inicio">
              <BrandLogo
                height={36}
                textDisplay={{ base: "none", sm: "block" }}
                textSize={{ base: "xl", md: "2xl" }}
              />
            </Link>
          </Box>

          {hasActions && (
            <HStack order={{ base: 2, md: 3 }} gap={1} ml="auto">
              {showCart && <HeaderAction label="Carrito" icon={FaShoppingCart} />}
              {showFavorites && <HeaderAction label="Favoritos" icon={FaHeart} />}
            </HStack>
          )}

          {showSearch && (
            <Box
              order={{ base: 3, md: 2 }}
              width={{ base: "100%", md: "auto" }}
              flex={{ md: "1" }}
              maxW="480px"
              mx={hasActions ? undefined : "auto"}
            >
              <InputGroup
                startElement={
                  <FaSearch size={16} color="var(--chakra-colors-gray-500)" />
                }
              >
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => handleChange(event.target.value)}
                  placeholder={placeholder}
                  aria-label={placeholder}
                  borderRadius="full"
                  bg="gray.50"
                />
              </InputGroup>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
