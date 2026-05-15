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
import { useAuth } from './context/authContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const {getUsuarioFromToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      
      getUsuarioFromToken(token).then((usuario) => {
        navigate('/')
      }
    )
      
    } else {
      console.log("No token found in localStorage.");
    }
  }, [])
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
