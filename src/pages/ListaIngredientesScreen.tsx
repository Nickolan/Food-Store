import { useContext, useEffect, useState } from "react"

import { IngredientesContext } from "../context/ingredientesContext"

import { Link, useNavigate } from "react-router-dom"



export default function ListaIngredientesScreen() {

  const context = useContext(IngredientesContext)
  const navigate = useNavigate()

  if (!context) return null
  const [pagina, setPagina] = useState(0);
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
    <div className="w-full">
      <div className="flex justify-between items-center px-4 mb-6">
        <div>
          <h1 className="text-[#1D3557] text-2xl font-bold">Gestión de Ingredientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administrá el catálogo de ingredientes y alérgenos.
          </p>
        </div>
        <Link 
          to="/formulario-ingrediente" 
          className="bg-[#E63946] hover:bg-[#d92c3a] text-white font-bold px-4 py-2 rounded-lg transition-colors"
        >
          + Agregar Ingrediente
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="search"
              placeholder="Buscar ingrediente..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#1D3557] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none w-52"
            />
            <select
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#1D3557] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="true">Solo Activos</option>
              <option value="false">Inactivos</option>
            </select>
            <select
              value={filtroAlergeno}
              onChange={(e) => setFiltroAlergeno(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#1D3557] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none"
            >
              <option value="todos">Todos los Alérgenos</option>
              <option value="true">Sí (Alérgeno)</option>
              <option value="false">No (Sin Alérgeno)</option>
            </select>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {context.total} ingrediente{context.total !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-[#1D3557] text-xs uppercase font-bold">
              <tr>
                <th className="py-3 px-4 text-center">ID</th>
                <th className="py-3 px-4 text-center">Nombre</th>
                <th className="py-3 px-4 text-center">Descripción</th>
                <th className="py-3 px-4 text-center">Alérgeno</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filtrarIngredientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-sm text-gray-400 border-b border-gray-100">
                    No hay ingredientes para mostrar.
                  </td>
                </tr>
              ) : (
                filtrarIngredientes.map((i) => (
                  <tr key={i.id} className="transition hover:bg-gray-50">
                    <td className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center">
                      {i.id}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center font-medium">
                      {i.nombre}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center">
                      {i.descripcion || "Sin descripción"}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center">
                      {i.es_alergeno ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Alérgeno
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        i.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {i.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() => navigate(`/ingredientes/editar/${i.id}`)}
                          className="text-gray-400 hover:text-[#1D3557] transition-colors outline-none"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => context.eliminar(i.id!)}
                          className={`transition-colors outline-none ${
                            i.activo ? 'text-gray-400 hover:text-[#E63946]' : 'text-gray-400 hover:text-emerald-600'
                          }`}
                          title={i.activo ? "Dar de baja" : "Dar de alta"}
                        >
                          {i.activo ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button 
            disabled={pagina === 0}
            onClick={() => setPagina(p => p - 1)}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {pagina + 1} de {Math.max(1, Math.ceil(context.total / limit))}
          </span>
          <button 
            disabled={(pagina + 1) * limit >= context.total}
            onClick={() => setPagina(p => p + 1)}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )

}