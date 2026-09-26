import { Box, Container, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { BrandLogo } from "./BrandLogo";
import { SocialLinks } from "./SocialLinks";

interface ContactEntry {
  readonly icon: IconType;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
}

const CONTACTS: readonly ContactEntry[] = [
  {
    icon: FaPhone,
    label: "Andrey Cubero",
    value: "85666387",
    href: "tel:+50685666387",
  },
  {
    icon: FaPhone,
    label: "Rodrigo Cubero",
    value: "86170795",
    href: "tel:+50686170795",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Ubicación",
    value: "Sarchi, Sarchi, Costa Rica 21201",
  },
  {
    icon: FaClock,
    label: "Horario",
    value: "Lunes a Viernes, 8:00 am - 5:00 pm",
  },
  {
    icon: FaEnvelope,
    label: "Correo",
    value: "ventasalquimia.007@gmail.com",
    href: "mailto:ventasalquimia.007@gmail.com",
  },
];

export interface FooterProps {
  readonly tagline?: string;
}

export function Footer({
  tagline = "Alquimia natural para tu bienestar",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="white"
      borderTopWidth="1px"
      borderColor="border.subtle"
      color="black"
    >
      <Container maxW="container.xl" py={10}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={8}
        >
          <Stack gap={3} maxW="sm">
            <Text fontWeight="semibold" textStyle="md" color="black">
              {tagline}
            </Text>
            <Text fontSize="sm" color="gray.600">
              © {year} BioAlquimia. Todos los derechos reservados.
            </Text>
          </Stack>

          <SocialLinks color="black" fontSize="2xl" />

          <Stack gap={3} maxW="sm">
            <BrandLogo height={32} textSize="xl" />
            <Stack gap={2}>
              {CONTACTS.map((contact) => (
                <HStack
                  key={contact.label + contact.value}
                  gap={2}
                  align="flex-start"
                  fontSize="sm"
                  color="black"
                >
                  <Box pt="2px" color="black" flexShrink={0}>
                    <contact.icon size={16} />
                  </Box>
                  <Box color="gray.700">
                    <Text as="span" color="black" fontWeight="medium">
                      {contact.label}:{" "}
                    </Text>
                    {contact.href ? (
                      <Link
                        href={contact.href}
                        color="black"
                        textDecoration="underline"
                        _hover={{ color: "gray.600" }}
                      >
                        {contact.value}
                      </Link>
                    ) : (
                      <Text as="span">{contact.value}</Text>
                    )}
                  </Box>
                </HStack>
              ))}
            </Stack>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
