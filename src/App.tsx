import './App.css'
import {Routes, Route} from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import MenuScreen from './pages/MenuScreen'
import ListaIngredientesScreen from './pages/ListaIngredientesScreen'
import CrearIngredienteScreen from './pages/CrearIngredienteScreen'
import EditarIngredienteScreen from './pages/EditarIngredienteScreen'
import { ProductosPage } from './pages/ProductosPage'
import CategoriaScreen from './pages/CategoriaScreen'

function App() {

  return (
   <Routes>
    <Route path='/login' element={<LoginScreen/>}/>
    <Route path='/menu' element={<MenuScreen/>}/>
    <Route path='/ingredientes' element={<ListaIngredientesScreen/>}/>
    <Route path='/formulario-ingrediente' element={<CrearIngredienteScreen/>}/>
    <Route path='/ingredientes/editar/:id' element={<EditarIngredienteScreen/>}/>
    <Route path='/productos' element={<ProductosPage/>} />
    <Route path='/categorias' element={<CategoriaScreen/>}/>
   </Routes>
  )
}

export default App
