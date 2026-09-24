import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import {
  Box,
  Button,
  Center,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ADMIN_SESSION_KEY } from './AdminGate'

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    window.localStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({ email, at: Date.now() }),
    )
    navigate('/admin/inicio', { replace: true })
  }

  return (
    <Center minH="100svh" bg="gray.50">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        bg="white"
        width="sm"
        p={8}
      >
        <Stack gap={6}>
          <Stack gap={1}>
            <Heading size="md" textAlign="center">
              Administración Bioalquimia
            </Heading>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Ingresa para acceder
            </Text>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Field.Root required>
                <Field.Label>Correo / Usuario</Field.Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bioalquimia.cr"
                  autoComplete="username"
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>Contraseña</Field.Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Field.Root>
              <Button type="submit" colorPalette="green" width="full">
                Ingresar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Center>
  )
}