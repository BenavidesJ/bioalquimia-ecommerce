import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
} from '@chakra-ui/react'
import { ADMIN_SESSION_KEY } from './AdminGate'
import { Layout } from '../../components/common/Layout'

const navItems = [
  { to: '/admin/inicio', label: 'Inicio' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/inventario', label: 'Inventario' },
]

export function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    navigate('/admin', { replace: true })
  }

  return (
    <Layout>
      <Box minH="100%" bg="gray.50">
        <HStack
          justify="space-between"
          px={6}
          py={4}
          bg="white"
          borderBottomWidth="1px"
        >
          <Heading size="md">Bioalquimia Admin</Heading>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </HStack>
        <Container maxW="container.xl" py={8}>
          <Stack direction="row" gap={10} align="flex-start">
            <Stack gap={2} width="xs">
              {navItems.map((item) => (
                <Box
                  key={item.to}
                  borderWidth="1px"
                  borderRadius="md"
                  px={4}
                  py={2}
                >
                  <Link to={item.to}>{item.label}</Link>
                </Box>
              ))}
            </Stack>
            <Box flex="1">
              <Outlet />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Layout>
  )
}