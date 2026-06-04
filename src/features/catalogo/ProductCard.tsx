import type { Producto } from '../../models/Producto';

interface Props {
  producto: Producto;
  onAgregarAlCarrito?: (producto: Producto) => void;
  onSeleccionarProducto?: (producto: Producto) => void;  // NUEVO
}

function ProductCard({ producto, onAgregarAlCarrito, onSeleccionarProducto }: Props) {
  const imagenUrl = producto.imagenes_url?.[0];

  return (
    <article 
      className="group bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={() => onSeleccionarProducto?.(producto)}  // Click en toda la card
    >
      {/* Imagen */}
      <div className="relative w-full h-48 bg-orange-50 overflow-hidden flex items-center justify-center">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-orange-300 select-none">
            <span className="text-5xl">🍽️</span>
            <span className="text-xs font-medium text-orange-400">Sin imagen</span>
          </div>
        )}

        {/* Badge disponible */}
        {!producto.disponible && (
          <span className="absolute top-3 left-3 bg-stone-700/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            No disponible
          </span>
        )}

        {/* Categorías */}
        {producto.categorias && producto.categorias.length > 0 && (
          <span className="absolute top-3 right-3 bg-orange-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {producto.categorias[0].nombre}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3 className="text-stone-900 font-bold text-base leading-snug line-clamp-1">
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p className="text-stone-500 text-sm mt-1 leading-relaxed line-clamp-2">
              {producto.descripcion}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-orange-50">
          <span className="text-orange-600 font-extrabold text-xl">
            ${producto.precio_base.toFixed(2)}
          </span>
          <button
            id={`btn-carrito-${producto.id}`}
            onClick={(e) => {
              e.stopPropagation();  
              onAgregarAlCarrito?.(producto);
            }}
            disabled={!producto.disponible}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-200 disabled:cursor-not-allowed text-white disabled:text-stone-400 px-4 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;