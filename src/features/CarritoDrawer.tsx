import { useCarrito } from '../context/carritoContext';

function CarritoDrawer() {
  const {
    items,
    carritoAbierto,
    cerrarCarrito,
    quitarProducto,
    actualizarCantidad,
    vaciarCarrito,
    totalItems,
    totalPrecio,
  } = useCarrito();

  const handleCompletarCompra = () => {
    if (totalItems === 0) {
      alert('El carrito está vacío. Agregá productos antes de continuar.');
      return;
    }
    const resumen = items
      .map((i) => {
        const base = `• ${i.nombre} x${i.cantidad}`;
        const personalizacion =
          i.ingredientes_removidos.length > 0
            ? ` (sin: ${i.ingredientes_removidos.join(', ')})`
            : '';
        return base + personalizacion;
      })
      .join('\n');
    alert(
      `🛒 Resumen del carrito (${totalItems} producto${totalItems !== 1 ? 's' : ''}):\n\n${resumen}\n\nTotal: $${totalPrecio.toFixed(2)}`
    );
  };

  return (
    <>
      {/* Overlay */}
      {carritoAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={cerrarCarrito}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          carritoAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <h2 className="text-lg font-bold text-stone-900">
              Mi Carrito
              {totalItems > 0 && (
                <span className="ml-2 bg-orange-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={cerrarCarrito}
            className="p-2 rounded-xl hover:bg-orange-50 text-stone-500 hover:text-stone-800 transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center text-stone-400">
              <span className="text-6xl">🍽️</span>
              <p className="font-medium text-stone-500">Tu carrito está vacío</p>
              <p className="text-sm">Agregá productos desde el catálogo</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex items-start gap-4 bg-orange-50 rounded-2xl p-4 border border-orange-100"
              >
                {/* Imagen */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-orange-100 shrink-0 flex items-center justify-center">
                  {item.imagen_url ? (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🍽️</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm truncate">{item.nombre}</p>
                  <p className="text-orange-600 font-bold text-sm">${item.precio_base.toFixed(2)}</p>

                  {/* Ingredientes removidos */}
                  {item.ingredientes_removidos.length > 0 && (
                    <p className="text-xs text-red-500 mt-0.5 leading-snug">
                      Sin: {item.ingredientes_removidos.join(', ')}
                    </p>
                  )}

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => actualizarCantidad(item.key, item.cantidad - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-orange-200 text-orange-600 font-bold hover:bg-orange-100 transition-colors flex items-center justify-center"
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-stone-800">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidad(item.key, item.cantidad + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-orange-200 text-orange-600 font-bold hover:bg-orange-100 transition-colors flex items-center justify-center"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal + Eliminar */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-stone-800 font-bold text-sm">
                    ${(item.precio_base * item.cantidad).toFixed(2)}
                  </p>
                  <button
                    onClick={() => quitarProducto(item.key)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                    aria-label="Quitar del carrito"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-orange-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-stone-600 font-medium">Total</span>
              <span className="text-orange-600 font-extrabold text-xl">${totalPrecio.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCompletarCompra}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-colors duration-200 shadow-sm hover:shadow-md text-base"
            >
              Completar Compra
            </button>

            <button
              onClick={vaciarCarrito}
              className="w-full py-2.5 border border-orange-200 text-orange-600 hover:bg-orange-50 font-medium rounded-2xl transition-colors text-sm"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CarritoDrawer;
