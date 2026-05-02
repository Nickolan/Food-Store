import './App.css'
import {Routes, Route} from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import { ProductosPage } from './pages/ProductosPage'

function App() {

  return (
   <Routes>
    <Route path='/login' element={<LoginScreen/>} />
    <Route path='/productos' element={<ProductosPage/>} />
   </Routes>
  )
}

export default App
