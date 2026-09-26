import { Box, HStack, Link, Tooltip, type BoxProps } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export interface SocialLink {
  readonly label: string;
  /** Vacío = la red todavía no tiene perfil publicado. */
  readonly href: string;
  readonly icon: IconType;
}

/** @see SocialLinksProps.links */
const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100084116927447",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/bioalquimiacr?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
    icon: FaInstagram,
  },
  { label: "TikTok", href: "", icon: FaTiktok },
];

export interface SocialLinksProps {
  readonly links?: readonly SocialLink[];
  /** Color del icono. Hereda `currentColor` por defecto. */
  readonly color?: string;
  readonly fontSize?: BoxProps["fontSize"];
  /** Fondo del hover. Ajustar si el componente se usa sobre un fondo oscuro. */
  readonly hoverBg?: string;
}

const ICON_BOX_PROPS = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  p: 2,
  borderRadius: "md",
  fontSize: "1.25em",
} as const;

export function SocialLinks({
  links = SOCIAL_LINKS,
  color,
  fontSize,
  hoverBg = "gray.100",
}: SocialLinksProps) {
  return (
    <HStack gap={2}>
      {links.map((link) =>
        link.href ? (
          <Tooltip.Root key={link.label} openDelay={300}>
            <Tooltip.Trigger asChild>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                {...ICON_BOX_PROPS}
                color={color}
                fontSize={fontSize}
                transition="background 0.15s ease"
                _hover={{ bg: hoverBg }}
                _focusVisible={{ outline: "2px solid", outlineColor: "currentColor" }}
              >
                <link.icon />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>{link.label}</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        ) : (
          <Tooltip.Root key={link.label} openDelay={300}>
            <Tooltip.Trigger asChild>
              <Box
                as="span"
                aria-disabled="true"
                {...ICON_BOX_PROPS}
                color={color}
                fontSize={fontSize}
                opacity={0.45}
                cursor="default"
              >
                <link.icon />
              </Box>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>{link.label} — Próximamente</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        ),
      )}
    </HStack>
  );
}
