import { useContext, useState } from "react"
import { IngredientesContext } from "../context/ingredientesContext"
import { FiltrosIngrediente } from "../features/filtrosIngrediente"
import { IngredienteCard } from "../features/ingredienteCard"

export default function ListaIngredientesScreen() {
    const context=useContext(IngredientesContext)
    if (!context) return null 
    const [filtroNombre,setFiltroNombre]=useState("")
    const [filtroActivo,setFiltroActivo]=useState("todos")
    const [filtroAlergeno,setFiltroAlergeno]=useState("todos")

    const filtrarIngredientes=context.ingredientes.filter((i)=>{
     const coincideNombre=i.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
     const coincideActivo=filtroActivo==="todos" || (filtroActivo==="true" && i.activo) || (filtroActivo==="false" && !i.activo)
     const coincideAlergeno=filtroAlergeno==="todos" || (filtroAlergeno==="true" && i.es_alergeno) || (filtroAlergeno==="false" && !i.es_alergeno)
     return coincideNombre && coincideActivo && coincideAlergeno
    })
    return (
    <div>
      <h1 className="flex justify-center items-center text-5xl font-bold m-6 mb-10">Busqueda</h1>
      <div>
        <FiltrosIngrediente
          nombre={filtroNombre}
          setNombre={setFiltroNombre}
          activo={filtroActivo}
          setActivo={setFiltroActivo}
          es_alergeno={filtroAlergeno}
          setEsAlergeno={setFiltroAlergeno}
        />
        <h2 className="flex justify-center items-center text-3xl font-bold m-10">Resultados</h2>
        <p className="mb-6 text-lg ml-6">Mostrando {filtrarIngredientes.length} de {context.ingredientes.length} ingredientes</p>
        <div className="max-w-7xl md:w-5/6 lg:w-3/4 sm:w-5/6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {context.ingredientes.length === 0 ? (
            <p>No hay ingredientes para mostrar</p>
          ) : (
            filtrarIngredientes.map((i)=>{
              return (
                <IngredienteCard i={i} key={i.id} />
              )
            })
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
