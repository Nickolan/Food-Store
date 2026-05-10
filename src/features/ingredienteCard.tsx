import { useContext } from "react"

import type { Ingrediente } from "../models/Ingrediente"

import { IngredientesContext } from "../context/ingredientesContext"

import { useNavigate } from "react-router-dom"



export const IngredienteCard = ({ i }: { i: Ingrediente }) => {

  const context = useContext(IngredientesContext)

  const navigate = useNavigate()

  if (!context) return null

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm p-3 md:p-4 flex flex-row items-center bg-white hover:bg-gray-50 transition-all group gap-4">

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-gray-900 truncate">{i.nombre}</h2>
        <p className="text-xs text-gray-500 truncate max-w-md hidden sm:block">
          {i.descripcion || "Sin descripción"}
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${i.activo ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
          {i.activo ? 'Activo' : 'Inactivo'}
        </span>
        {i.es_alergeno && (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 text-amber-800 hidden md:block">
            Alérgeno
          </span>
        )}
      </div>

      <div className="flex flex-row items-center gap-1 border-l border-gray-100 pl-2 md:pl-4">
        <button
          onClick={() => navigate(`/ingredientes/editar/${i.id}`)}
          className="text-blue-600 hover:bg-blue-50 text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors">
          EDITAR
        </button>

        <button
          onClick={() => context.eliminar(i.id!)}
          className={`text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors ${i.activo
            ? 'text-amber-600 hover:bg-amber-50'
            : 'text-emerald-600 hover:bg-emerald-50'
            }`}
        >
          {i.activo ? 'BAJA' : 'ALTA'}
        </button>
      </div>
    </div>
  )

}