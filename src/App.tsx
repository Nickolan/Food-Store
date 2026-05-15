import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import ListaIngredientesScreen from './pages/ListaIngredientesScreen'
import CrearIngredienteScreen from './pages/CrearIngredienteScreen'
import EditarIngredienteScreen from './pages/EditarIngredienteScreen'
import { ProductosPage } from './pages/ProductosPage'
import CategoriaScreen from './pages/CategoriaScreen'
import ProtectedRoute from './features/ProtectedRoute'
import DashboardLayout from './features/DashboardLayout'
import DashboardWelcome from './pages/DashboardWelcome'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginScreen />} />
      
      <Route path='/' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardWelcome />} />
        <Route path='categorias' element={<CategoriaScreen />} />
        <Route path='ingredientes' element={<ListaIngredientesScreen />} />
        <Route path='formulario-ingrediente' element={<CrearIngredienteScreen />} />
        <Route path='ingredientes/editar/:id' element={<EditarIngredienteScreen />} />
        <Route path='productos' element={<ProductosPage />} />
      </Route>
    </Routes>
  )
}

export default App
