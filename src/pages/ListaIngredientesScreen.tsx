import { useContext, useEffect, useState } from "react"

import { IngredientesContext } from "../context/ingredientesContext"

import { FiltrosIngrediente } from "../features/filtrosIngrediente"

import { IngredienteCard } from "../features/ingredienteCard"

import { Link } from "react-router-dom"



export default function ListaIngredientesScreen() {

  const context = useContext(IngredientesContext)

  if (!context) return null
  const [pagina, setPagina] = useState(0); // <--- NUEVO: Estado de página
  const [limit] = useState(10);
  const [filtroNombre, setFiltroNombre] = useState("")

  const [filtroActivo, setFiltroActivo] = useState("todos")

  const [filtroAlergeno, setFiltroAlergeno] = useState("todos")

 useEffect(() => {
    context.getIngredientes(pagina * limit, limit);
  }, [pagina]);
   const inicio = pagina * limit + 1;

const fin = Math.min((pagina * limit) + context.ingredientes.length, context.total);
  const filtrarIngredientes = (Array.isArray(context.ingredientes) ? context.ingredientes : []).filter((i) => {

    const coincideNombre = i.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
 
    const coincideActivo = filtroActivo === "todos" || (filtroActivo === "true" && i.activo) || (filtroActivo === "false" && !i.activo)

    const coincideAlergeno = filtroAlergeno === "todos" || (filtroAlergeno === "true" && i.es_alergeno) || (filtroAlergeno === "false" && !i.es_alergeno)

    return coincideNombre && coincideActivo && coincideAlergeno

  })

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Administrá el catálogo de ingredientes y alérgenos.
          </p>
        </div>
        <Link 
          to="/formulario-ingrediente" 
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          + Agregar Ingrediente
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <FiltrosIngrediente
              nombre={filtroNombre}
              setNombre={setFiltroNombre}
              activo={filtroActivo}
              setActivo={setFiltroActivo}
              es_alergeno={filtroAlergeno}
              setEsAlergeno={setFiltroAlergeno}
            />
          </div>
          <span className="text-sm text-gray-500 mb-6">
            {context.total} ingrediente{context.total !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {context.ingredientes.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No hay ingredientes para mostrar</p>
          ) : (
            filtrarIngredientes.map((i) => (
              <IngredienteCard i={i} key={i.id} />
            ))
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-8">
        <button 
          disabled={pagina === 0}
          onClick={() => setPagina(p => p - 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 transition"
        >
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página <strong>{pagina + 1}</strong> de <strong>{Math.ceil(context.total / limit)}</strong>
        </span>

        <button 
          disabled={(pagina + 1) * limit >= context.total}
          onClick={() => setPagina(p => p + 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

  )

}