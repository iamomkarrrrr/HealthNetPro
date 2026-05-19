import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default RoleRoute
