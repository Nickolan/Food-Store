import './App.css'
import {Routes, Route} from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'

function App() {

  return (
   <Routes>
    <Route path='/login' element={<LoginScreen/>}/>
   </Routes>
  )
}

export default App
