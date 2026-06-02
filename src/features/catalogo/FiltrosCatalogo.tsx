import type { Categoria } from '../../models/Categoria';

interface Props {
  categorias: Categoria[];
  categoriaSeleccionada: number | null;
  onCategoriaChange: (id: number | null) => void;
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  totalResultados: number;
}

function FiltrosCatalogo({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
  busqueda,
  onBusquedaChange,
  totalResultados,
}: Props) {
  return (
    <aside className="w-full md:w-72 shrink-0 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-stone-900">Filtros</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          {totalResultados} resultado{totalResultados !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Búsqueda por nombre */}
      <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
        <label htmlFor="busqueda-catalogo" className="block text-sm font-bold text-stone-800 mb-3">
          Buscar producto
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="busqueda-catalogo"
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Ej: Pizza, hamburguesa..."
            className="w-full h-11 pl-10 pr-4 bg-orange-50 border border-orange-100 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
          {busqueda && (
            <button
              onClick={() => onBusquedaChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filtro por categoría */}
      <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-bold text-stone-800">
            Categoría
          </label>
          <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
            Próximamente
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {/* Opción "Todas" — siempre activa */}
          <button
            id="categoria-todas"
            onClick={() => onCategoriaChange(null)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              categoriaSeleccionada === null
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-200'
                : 'text-stone-600 hover:bg-orange-50 hover:text-orange-700'
            }`}
          >
            🍽️ Todas las categorías
          </button>

          {/* Categorías dinámicas — deshabilitadas hasta que el backend lo soporte */}
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => onCategoriaChange(categoria.id)}
              id={`categoria-${categoria.id}`}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              categoriaSeleccionada === categoria.id
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-200'
                : 'text-stone-600 hover:bg-orange-50 hover:text-orange-700'
            }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Limpiar filtros */}
      {(categoriaSeleccionada !== null || busqueda) && (
        <button
          id="btn-limpiar-filtros"
          onClick={() => {
            onCategoriaChange(null);
            onBusquedaChange('');
          }}
          className="w-full py-2.5 px-4 rounded-xl border border-orange-200 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-colors duration-200"
        >
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}

export default FiltrosCatalogo;
