import { useCallback, useEffect, useRef } from 'react';
import Navbar from '../features/Navbar';
import { obtenerPedidos, cancelarPedido } from '../api/pedidosApi';
import type { PedidoRead } from '../api/pedidosApi';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import CarritoDrawer from '../features/CarritoDrawer';
import { useWebSocket, type WsMessage } from '../hooks/useWebSocket';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';

// Query key compartida con el hook de WS para que los updates reactivos funcionen
const PEDIDOS_CLIENT_KEY = ['pedidos', 'client'] as const;

function MisPedidosScreen() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const PAGE_SIZE = 5;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState<number | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');

  // ── Redirigir si no autenticado ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const { data: pedidos = [], isLoading, isError } = useQuery({
    queryKey: [...PEDIDOS_CLIENT_KEY, page] as const,
    queryFn: () => obtenerPedidos(page * PAGE_SIZE, PAGE_SIZE),
    enabled: isAuthenticated,
    placeholderData: (prev) => prev,
  });

  const hasMore = pedidos.length === PAGE_SIZE;

  // ── Cancelar pedido ──────────────────────────────────────────────────────
  const cancelarMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      cancelarPedido(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_CLIENT_KEY });
      cerrarModalCancelacion();
    },
    onError: () => alert('Hubo un error al cancelar el pedido.'),
  });

  const abrirModalCancelacion = (id: number) => {
    setPedidoACancelar(id);
    setMotivoCancelacion('');
    setModalAbierto(true);
  };

  const cerrarModalCancelacion = () => {
    setModalAbierto(false);
    setPedidoACancelar(null);
    setMotivoCancelacion('');
  };

  const confirmarCancelacion = () => {
    if (pedidoACancelar === null) return;
    cancelarMutation.mutate({
      id: pedidoACancelar,
      motivo: motivoCancelacion || 'Cancelado por el cliente',
    });
  };


   const { subscribeToOrder } = useWebSocket({
    enabled: isAuthenticated,
    onMessage: useCallback(
      (msg: WsMessage) => {
        console.log("ENVIADO DESDE MisPedidosScreen",msg);
        
        if (msg.event === "WS_CONNECTED") {
          queryClient
            .invalidateQueries({ queryKey: ["pedidos", "client"] })
            .then(() => {
              const latest =
                queryClient.getQueryData<PedidoRead[]>([
                  "pedidos",
                  "client",
                ]) ?? [];
              latest
                .filter((p) => !["ENTREGADO", "CANCELADO"].includes(p.estado_codigo))
                .forEach((p) => subscribeToOrderRef.current?.(p.id));
            });
          return;
        }
        const updateEvents = [
          "PEDIDO_CONFIRMADO",
          "PEDIDO_EN_PREPARACION",
          "PEDIDO_LISTO",
          "PEDIDO_CANCELADO",
          "PEDIDO_ENTREGADO",
        ];
        if (updateEvents.includes(msg.event)) {
          console.log("ACTUALIZANDO EVENTOS");
          console.log("DATA: ",msg.data);
          
          
          const updated = msg.data as PedidoRead;
          console.log("ACTUALIZADO", updated);

          // Actualizar TODAS las páginas cacheadas que contengan el pedido modificado
          queryClient.setQueriesData<PedidoRead[]>(
            { queryKey: PEDIDOS_CLIENT_KEY },
            (prev) => {
              if (!prev) return prev;
              return prev.map((p) => (p.id === updated.id ? updated : p));
            },
          );
        }
      },
      [queryClient],
    ),
  });

  const subscribeToOrderRef = useRef(subscribeToOrder);
  useEffect(() => {
    subscribeToOrderRef.current = subscribeToOrder;
  });

  useEffect(() => {
    console.log("Pedidos desde USEFFECT",pedidos);
    
    pedidos
      .filter((p) => !["ENTREGADO", "CANCELADO"].includes(p.estado_codigo))
      .forEach((p) => subscribeToOrder(p.id));
  }, [pedidos, subscribeToOrder]);

  // ── Helpers de presentación ──────────────────────────────────────────────
  // Códigos alineados con el seed: PENDIENTE, CONFIRMADO, EN_PREP, EN_CAMINO, ENTREGADO, CANCELADO
  const getEstadoColor = (codigo: string) => {
    switch (codigo.toUpperCase()) {
      case 'PENDIENTE':  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMADO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EN_PREP':    return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EN_CAMINO':  return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'ENTREGADO':  return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELADO':  return 'bg-red-100 text-red-800 border-red-200';
      default:           return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoTexto = (codigo: string): string => {
    const mapeo: Record<string, string> = {
      PENDIENTE:  'Pendiente',
      CONFIRMADO: 'Confirmado',
      EN_PREP:    'En preparación',
      EN_CAMINO:  'En camino',
      ENTREGADO:  'Entregado',
      CANCELADO:  'Cancelado',
    };
    return mapeo[codigo.toUpperCase()] ?? codigo;
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-orange-50 min-h-screen">
      <Navbar />
      <CarritoDrawer />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Mis Pedidos</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
            No se pudieron cargar tus pedidos.
          </div>
        ) : pedidos.length === 0 && page === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-orange-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no tenés pedidos</h2>
            <p className="text-stone-500 mb-6">Empezá a explorar nuestro catálogo y hacé tu primer pedido.</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
            >
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-stone-200">
                <p className="text-stone-500">No hay más pedidos en esta página.</p>
              </div>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-stone-500 font-medium">
                        Pedido #{pedido.id} • {pedido.created_at ? new Date(pedido.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                      <p className="text-stone-600 text-sm mt-1">
                        Pago: <span className="font-semibold">{pedido.forma_pago_codigo}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getEstadoColor(pedido.estado_codigo)}`}>
                        {getEstadoTexto(pedido.estado_codigo)}
                      </span>
                      {pedido.estado_codigo.toUpperCase() === 'PENDIENTE' && (
                        <button
                          onClick={() => abrirModalCancelacion(pedido.id)}
                          disabled={cancelarMutation.isPending && pedidoACancelar === pedido.id}
                          className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {cancelarMutation.isPending && pedidoACancelar === pedido.id
                            ? 'Cancelando...'
                            : 'Cancelar'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between gap-6">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Artículos</h4>
                        <ul className="space-y-3">
                          {pedido.detalle.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-start text-sm">
                              <div className="flex items-start gap-3">
                                <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md min-w-[2rem] text-center">
                                  {item.cantidad}x
                                </span>
                                <span className="text-stone-700 font-medium">{item.nombre_snapshot}</span>
                              </div>
                              <span className="text-stone-900 font-medium whitespace-nowrap ml-4">
                                ${Number(item.subtotal_snap).toLocaleString('es-AR')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="w-full md:w-64 bg-stone-50 rounded-xl p-4 border border-stone-100 flex flex-col justify-center">
                        <div className="space-y-2 mb-3 pb-3 border-b border-stone-200">
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>Subtotal</span>
                            <span>${Number(pedido.subtotal).toLocaleString('es-AR')}</span>
                          </div>
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>Envío</span>
                            <span>${Number(pedido.costo_envio).toLocaleString('es-AR')}</span>
                          </div>
                          {Number(pedido.descuento) > 0 && (
                            <div className="flex justify-between text-sm text-green-600 font-medium">
                              <span>Descuento</span>
                              <span>-${Number(pedido.descuento).toLocaleString('es-AR')}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-900">Total</span>
                          <span className="text-xl font-extrabold text-orange-600">${Number(pedido.total).toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                    </div>

                    {pedido.notas && (
                      <div className="mt-4 bg-orange-50/50 p-3 rounded-lg border border-orange-100 text-sm text-stone-600">
                        <span className="font-semibold text-orange-800">Notas:</span> {pedido.notas}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            <div className="flex items-center justify-between border-t border-stone-200 bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm mt-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="relative inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                  className="relative ml-3 inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-stone-700">
                  Mostrando página <span className="font-medium">{page + 1}</span>
                </p>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-stone-400 ring-1 ring-inset ring-stone-300 hover:bg-stone-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-stone-400 ring-1 ring-inset ring-stone-300 hover:bg-stone-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Cancelación */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-lg font-bold text-gray-900">Cancelar pedido #{pedidoACancelar}</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-stone-600 text-sm mb-4">
                ¿Estás seguro que querés cancelar este pedido? Si querés, podés dejarnos el motivo de la cancelación.
              </p>
              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-stone-700 mb-1">
                  Motivo (Opcional)
                </label>
                <textarea
                  id="motivo"
                  rows={3}
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  className="w-full rounded-xl border-stone-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border resize-none"
                  placeholder="Ej: Me equivoqué al elegir los productos..."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
              <button
                onClick={cerrarModalCancelacion}
                disabled={cancelarMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200 bg-stone-100 rounded-lg transition-colors"
              >
                Volver
              </button>
              <button
                onClick={confirmarCancelacion}
                disabled={cancelarMutation.isPending}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {cancelarMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cancelando...
                  </>
                ) : (
                  'Sí, cancelar pedido'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisPedidosScreen;
