import './App.css'
import { Routes, Route } from 'react-router-dom'
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
      <Route path='/admin' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'PEDIDOS']}>
              <DashboardLayout />
          </ProtectedRoute>
      }>
        <Route index element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin/pedidos">
            <DashboardWelcome />
          </ProtectedRoute>
        } />
        <Route path='categorias' element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin/pedidos">
            <CategoriaScreen />
          </ProtectedRoute>
        } />
        <Route path='ingredientes' element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin/pedidos">
            <ListaIngredientesScreen />
          </ProtectedRoute>
        } />
        <Route path='formulario-ingrediente' element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin/pedidos">
            <CrearIngredienteScreen />
          </ProtectedRoute>
        } />
        <Route path='ingredientes/editar/:id' element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin/pedidos">
            <EditarIngredienteScreen />
          </ProtectedRoute>
        } />
        <Route path='productos' element={
          <ProtectedRoute rolesHabilitados={['ADMIN']} fallbackRedirect="/admin/pedidos">
            <ProductosPage />
          </ProtectedRoute>
        } />
        <Route path='pedidos' element={<PedidosScreen />} />
      </Route>
    </Routes>
  )
}

export default App;