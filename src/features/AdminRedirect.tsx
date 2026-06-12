import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ADMIN_ROLES = ['ADMIN', 'STOCK', 'PEDIDOS'];

/**
 * Envuelve rutas públicas (landing, catálogo, etc.).
 * Si el usuario autenticado tiene un rol de admin, lo redirige a /admin.
 * Si no, deja pasar al componente hijo normalmente.
 */
const AdminRedirect = ({ children }: { children: ReactNode }) => {
  const { usuario } = useAuth();

  const roles = usuario?.roles?.map((r) => r.codigo) ?? [];
  const esAdmin = roles.some((r) => ADMIN_ROLES.includes(r));

  if (esAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminRedirect;
