import './App.css'
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import MenuScreen from './pages/MenuScreen'
import ListaIngredientesScreen from './pages/ListaIngredientesScreen'
import CrearIngredienteScreen from './pages/CrearIngredienteScreen'
import EditarIngredienteScreen from './pages/EditarIngredienteScreen'
import { ProductosPage } from './pages/ProductosPage'
import CategoriaScreen from './pages/CategoriaScreen'
import ProtectedRoute from './features/ProtectedRoute'
import { useEffect } from 'react'

function App() {

  const location = useLocation()
  const navigate = useNavigate()


  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login')
    }
  }, [])

  return (
  <Routes>
  <Route path='/login' element={<LoginScreen/>}/>
  <Route path='/menu' element={<ProtectedRoute><MenuScreen/></ProtectedRoute>} />
  <Route path='/ingredientes' element={<ProtectedRoute><ListaIngredientesScreen/></ProtectedRoute>} />
  <Route path='/formulario-ingrediente' element={<ProtectedRoute><CrearIngredienteScreen/></ProtectedRoute>} />
  <Route path='/ingredientes/editar/:id' element={<ProtectedRoute><EditarIngredienteScreen/></ProtectedRoute>} />
  <Route path='/productos' element={<ProtectedRoute><ProductosPage/></ProtectedRoute>} />
  <Route path='/categorias' element={<ProtectedRoute><CategoriaScreen/></ProtectedRoute>} />
   </Routes>
  )
}

export default App
