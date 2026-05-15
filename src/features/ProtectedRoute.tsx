import { type JSX } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'

interface Props {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: Props) => {
  const auth = useAuth()
  const location = useLocation()

  if (!auth) return null

  if (auth.isAuthenticated) return children

  // Allow access to the login page even when not authenticated
  if (location.pathname === '/login') return children

  return <Navigate to="/login" replace />
}

export default ProtectedRoute
