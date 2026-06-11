import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import LoginScreen from './pages/LoginScreen'
import ListaIngredientesScreen from './pages/ListaIngredientesScreen'
import CrearIngredienteScreen from './pages/CrearIngredienteScreen'
import EditarIngredienteScreen from './pages/EditarIngredienteScreen'
import { ProductosPage } from './pages/ProductosPage'
import CategoriaScreen from './pages/CategoriaScreen'
import ProtectedRoute from './features/ProtectedRoute'
import DashboardLayout from './features/DashboardLayout'
import DashboardWelcome from './pages/DashboardWelcome'
import { useAuth } from './context/authContext'
import LandingScreen from './pages/LandingScreen'
import SignUpScreen from './pages/SignUpScreen'
import CatalogoScreen from './pages/CatalogoScreen'
import PerfilScreen from './pages/PerfilScreen'
import EditarPerfilScreen from './pages/EditarPerfilScreen'
import PedidosScreen from './pages/PedidosScreen'
import CheckoutScreen from './pages/CheckoutScreen'
import SuccessScreen from './pages/SuccessScreen'
import FailureScreen from './pages/FailureScreen'
import PendingScreen from './pages/PendingScreen'
import MisPedidosScreen from './pages/MisPedidosScreen'
import ListaUsuariosScreen from './pages/ListaUsuariosScreen'
import StockScreen from './pages/StockScreen'

function RoleRedirect() {
  const { usuario } = useAuth();
  const roles = usuario?.roles?.map(r => r.codigo) ?? [];
  if (roles.includes('ADMIN')) return <DashboardWelcome />;
  if (roles.includes('PEDIDOS')) return <Navigate to="/admin/pedidos" replace />;
  if (roles.includes('STOCK')) return <Navigate to="/admin/stock" replace />;
  return <Navigate to="/" replace />;
}

function App() {
  const { getUsuarioFromToken } = useAuth();

  useEffect(() => {
    getUsuarioFromToken().catch(() => {
        console.log("No hay sesión activa o la cookie expiró.");
    });
  }, []);

  return (
    <Routes>
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/' element={<LandingScreen />} />
      <Route path='/signup' element={<SignUpScreen />} />
      <Route path='/catalogo' element={<CatalogoScreen />} />
      <Route path='/usuario/:id' element={<PerfilScreen />} />
      <Route path='/usuario/:id/editar' element={<EditarPerfilScreen />} />
      <Route path='/checkout' element={<CheckoutScreen />} />
      <Route path='/success' element={<SuccessScreen />} />
      <Route path='/failure' element={<FailureScreen />} />
      <Route path='/pending' element={<PendingScreen />} />
      <Route path='/mis-pedidos' element={<MisPedidosScreen />} />
      <Route path='/admin' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'PEDIDOS', 'STOCK']}>
              <DashboardLayout />
          </ProtectedRoute>
      }>
        <Route index element={<RoleRedirect />} />
        <Route path='categorias' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'STOCK']} fallbackRedirect="/admin/pedidos">
            <CategoriaScreen />
          </ProtectedRoute>
        } />
        <Route path='ingredientes' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'STOCK']} fallbackRedirect="/admin/pedidos">
            <ListaIngredientesScreen />
          </ProtectedRoute>
        } />
        <Route path='formulario-ingrediente' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'STOCK']} fallbackRedirect="/admin/pedidos">
            <CrearIngredienteScreen />
          </ProtectedRoute>
        } />
        <Route path='ingredientes/editar/:id' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'STOCK']} fallbackRedirect="/admin/pedidos">
            <EditarIngredienteScreen />
          </ProtectedRoute>
        } />
        <Route path='productos' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'STOCK']} fallbackRedirect="/admin/pedidos">
            <ProductosPage />
          </ProtectedRoute>
        } />
        <Route path='usuarios' element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin">
            <ListaUsuariosScreen />
          </ProtectedRoute>
        } />
        <Route path='stock' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'STOCK']} fallbackRedirect="/admin/pedidos">
            <StockScreen />
          </ProtectedRoute>
        } />
        <Route path='pedidos' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'PEDIDOS']} fallbackRedirect="/admin/stock">
            <PedidosScreen />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App;
