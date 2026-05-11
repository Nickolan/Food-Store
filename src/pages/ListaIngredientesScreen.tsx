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

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">Alérgeno</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtrarIngredientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    No hay ingredientes que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filtrarIngredientes.map((i) => (
                  <tr key={i.id} className={`transition hover:bg-gray-50 ${!i.activo ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-500">#{i.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{i.nombre}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{i.descripcion || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${i.es_alergeno ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                        {i.es_alergeno ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${i.activo ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-700'}`}>
                        {i.activo ? 'Activo' : 'Baja'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/ingredientes/editar/${i.id}`}
                          className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => context.eliminar(i.id!)}
                          className={`rounded px-2 py-1 text-xs font-medium transition ${i.activo ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                            }`}
                        >
                          {i.activo ? "Dar de baja" : "Dar de alta"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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