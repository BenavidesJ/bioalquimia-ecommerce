import { Center, Heading, Stack, Text } from '@chakra-ui/react'

export function LandingPage() {
  return (
    <Center minH="100svh" bg="green.50">
      <Stack gap={4} textAlign="center" px={6}>
        <Heading size="2xl" color="green.800">
          Bioalquimia
        </Heading>
        <Text color="gray.600">
          Catálogo de productos — landing en construcción
        </Text>
      </Stack>
    </Center>
  )
}