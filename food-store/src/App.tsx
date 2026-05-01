import './App.css'
import {Routes, Route} from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import MenuScreen from './pages/MenuScreen'

function App() {

  return (
   <Routes>
    <Route path='/login' element={<LoginScreen/>}/>
    <Route path='/menu' element={<MenuScreen/>}/>   
    </Routes>
  )
}

export default App
