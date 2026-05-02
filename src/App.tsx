import './App.css'
import {Routes, Route} from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import MenuScreen from './pages/MenuScreen'
import ListaIngredientesScreen from './pages/ListaIngredientesScreen'

function App() {

  return (
   <Routes>
    <Route path='/login' element={<LoginScreen/>}/>
    <Route path='/menu' element={<MenuScreen/>}/>
    <Route path='/ingredientes' element={<ListaIngredientesScreen/>}/>   
    </Routes>
  )
}

export default App
