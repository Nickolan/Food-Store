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

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const esAdmin = usuario?.roles?.some((r) => r.codigo === 'ADMIN');
  if (!esAdmin) {
    return <Navigate to="/admin/pedidos" replace />;
  }
  return <>{children}</>;
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
      <Route path='/admin' element={
          <ProtectedRoute rolesHabilitados={['ADMIN', 'PEDIDOS']}>
              <DashboardLayout />
          </ProtectedRoute>
      }>
        <Route index element={<DashboardWelcome />} />
        <Route path='categorias' element={<AdminOnly><CategoriaScreen /></AdminOnly>} />
        <Route path='ingredientes' element={<AdminOnly><ListaIngredientesScreen /></AdminOnly>} />
        <Route path='formulario-ingrediente' element={<AdminOnly><CrearIngredienteScreen /></AdminOnly>} />
        <Route path='ingredientes/editar/:id' element={<AdminOnly><EditarIngredienteScreen /></AdminOnly>} />
        <Route path='productos' element={<AdminOnly><ProductosPage /></AdminOnly>} />
        <Route path='pedidos' element={<PedidosScreen />} />
      </Route>
    </Routes>
  )
}

export default App;