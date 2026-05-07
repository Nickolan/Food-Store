import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IngredientesContext } from "../context/ingredientesContext"
import { FormularioIngrediente } from "../features/formularioIngrediente"
export default function CrearIngredienteScreen() {
  const navigate=useNavigate()
  const context=useContext(IngredientesContext)
    if (!context){
        return null
    }
  useEffect(()=>{
    context.setIngredienteSeleccionado(null)
  },[])
  return (
    <div>
      <FormularioIngrediente onSuccess={()=>{navigate("/ingredientes")}} />
    </div>
  )
}
