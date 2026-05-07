import { useContext } from "react"
import type { Ingrediente } from "../models/Ingrediente"
import { IngredientesContext } from "../context/ingredientesContext"
import { useNavigate } from "react-router-dom"

export const IngredienteCard = ({ i }: { i: Ingrediente }) => {
    const context = useContext(IngredientesContext)
    const navigate = useNavigate()
    if (!context) return null
    const borderColor = i.activo ? 'border-green-500' : 'border-red-500';

    return (
        <div
            className={`border-2 ${borderColor} rounded-lg shadow-md p-4 flex flex-col bg-white hover:shadow-lg transition-shadow`}
        >
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold truncate pr-2">{i.nombre}</h2>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${i.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {i.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        {i.es_alergeno && (
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-orange-100 text-orange-800">
                                Alérgeno
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {i.descripcion || "Sin descripción"}
                </p>
            </div>

            <div className="flex justify-end gap-2 mt-auto pt-4 border-t">
                <button
                    onClick={() => navigate(`/ingredientes/editar/${i.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
                >
                    EDITAR
                </button>
                <button
                    onClick={() => context.eliminar(i.id!)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
                >
                    ELIMINAR
                </button>
            </div>
        </div>
    )
}