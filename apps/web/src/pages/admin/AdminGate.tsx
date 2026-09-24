import { Outlet } from 'react-router-dom'
import { AdminLogin } from './AdminLogin'

export const ADMIN_SESSION_KEY = 'bioalquimia.admin.session'

export function AdminGate() {
  const hasSession = typeof window !== 'undefined'
    ? window.localStorage.getItem(ADMIN_SESSION_KEY) !== null
    : false

  if (!hasSession) {
    return <AdminLogin />
  }

  return <Outlet />
}