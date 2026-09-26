import type { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export interface LayoutProps {
  readonly children: ReactNode;
  /**
   * Feature flag del botón de carrito del Header.
   * @default false
   */
  readonly showCart?: boolean;
  /**
   * Feature flag del botón de favoritos del Header.
   * @default false
   */
  readonly showFavorites?: boolean;
}

export function Layout({
  children,
  showCart = false,
  showFavorites = false,
}: LayoutProps) {
  return (
    <Flex direction="column" minH="100svh" bg="gray.50">
      <Header showCart={showCart} showFavorites={showFavorites} />
      <Box as="main" flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
