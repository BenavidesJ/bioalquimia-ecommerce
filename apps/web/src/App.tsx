import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { AdminGate } from './pages/admin/AdminGate'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminInventory } from './pages/admin/AdminInventory'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminProducts } from './pages/admin/AdminProducts'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminGate />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="inicio" element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="inventario" element={<AdminInventory />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App