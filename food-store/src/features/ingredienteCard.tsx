import { useContext } from "react"
import type { Ingrediente } from "../models/Ingrediente"
import { IngredientesContext } from "../context/ingredientesContext"
import { useNavigate } from "react-router-dom"

export const IngredienteCard=({i}:{i:Ingrediente})=>{
    const context=useContext(IngredientesContext)
    if (!context) return null 
    const bgColor= i.activo ? "bg-green-500" : "bg-red-500"
    const navigate=useNavigate()
    return (
    <div key={i.id} className={`${bgColor} shadow rounded p-4 hover:shadow-lg transition`}>
      <h3>{i.nombre}</h3>
      <p>{i.descripcion}</p>
      <p>Es alergeno:{i.es_alergeno?"Sí":"No"}</p>
      <div className="flex justify-left items-left">
        <button className="bg-blue-600 text-white rounded mt-3 py-2 px-3" onClick={()=>{
          navigate(`/ingredientes/editar/${i.id}`)
          }}>Editar</button>
        <button className="bg-red-600 text-white rounded mt-3 py-2 px-3" onClick={()=>context.eliminar(i.id!)}>Eliminar</button>
       </div>
    </div>
  )
}