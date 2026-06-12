import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../context/authContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPedidos } from "../api/pedidosApi";
import { usuarioApi } from "../api/usuarioApi";
import type { PedidoRead } from "../models/Pedido";
import type { Usuario } from "../models/Usuario";
import CambiarEstadoDropdown from "../features/components/pedidos/CambiarEstadoDropdown";
import DetallePedidoModal from "../features/components/pedidos/DetallePedidoModal";
import { useWebSocket, type WsMessage } from "../hooks/useWebSocket";


const PAGE_SIZE = 10;

const PEDIDOS_ADMIN_KEY = ['pedidos', 'admin'] as const;

const ETIQUETAS_PAGO: Record<string, string> = {
  MERCADOPAGO: "Mercado Pago",
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

const ESTADOS_FILTRO = [
  { value: "", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "EN_PREP", label: "En preparación" },
  { value: "EN_CAMINO", label: "En camino" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
];

export default function PedidosScreen() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  useWebSocket({
    enabled: isAuthenticated,
    onMessage: useCallback(
      (msg: WsMessage) => {
        if (msg.event === "WS_CONNECTED") {
          queryClient.invalidateQueries({ queryKey: PEDIDOS_ADMIN_KEY });
          return;
        }
        if (msg.event === "NUEVO_PEDIDO") {
          //const nuevo = msg.data as PedidoRead;
          // Invalidar para que la primera página se recargue con el nuevo pedido
          queryClient.invalidateQueries({ queryKey: PEDIDOS_ADMIN_KEY });
        } else if (msg.data && (msg.data as PedidoRead).id) {
          const updated = msg.data as PedidoRead;
          // Actualizar TODAS las páginas cacheadas que contengan el pedido modificado
          queryClient.setQueriesData<PedidoRead[]>(
            { queryKey: PEDIDOS_ADMIN_KEY },
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

  const [page, setPage] = useState(0);

  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [pedidoDetalle, setPedidoDetalle] = useState<PedidoRead | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...PEDIDOS_ADMIN_KEY, { page }],
    queryFn: () => getPedidos({ skip: page * PAGE_SIZE, limit: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  });

  const { data: usuarios } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await usuarioApi.listarUsuarios(0, 100);
      return res.items;
    },
  });

  const pedidos = data ?? [];

  const usuarioMap = useMemo(() => {
    const map: Record<number, Usuario> = {};
    if (!usuarios) return map;
    for (const u of usuarios) {
      map[u.id] = u;
    }
    return map;
  }, [usuarios]);

  const filteredPedidos = useMemo(() => {
    return pedidos.filter((p) => {
      if (filtroEstado && p.estado_codigo.toUpperCase() !== filtroEstado.toUpperCase()) {
        return false;
      }
      if (filtroUsuario) {
        const q = filtroUsuario.toLowerCase();
        const user = usuarioMap[p.usuario_id];
        if (
          !user ||
          (!user.nombre.toLowerCase().includes(q) &&
            !user.apellido.toLowerCase().includes(q) &&
            !user.email.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filtroFechaDesde && p.created_at) {
        if (new Date(p.created_at) < new Date(filtroFechaDesde)) return false;
      }
      if (filtroFechaHasta && p.created_at) {
        const hasta = new Date(filtroFechaHasta);
        hasta.setHours(23, 59, 59, 999);
        if (new Date(p.created_at) > hasta) return false;
      }
      return true;
    });
  }, [pedidos, filtroEstado, filtroUsuario, filtroFechaDesde, filtroFechaHasta, usuarioMap]);

  const limpiarFiltros = () => {
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
    setFiltroUsuario("");
    setFiltroEstado("");
  };

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const hayFiltrosActivos = filtroFechaDesde || filtroFechaHasta || filtroUsuario || filtroEstado;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-6">
        <div>
          <h1 className="text-stone-900 text-2xl font-bold">Gestión de Pedidos</h1>
          <p className="text-stone-500 text-sm mt-1">
            Administrá y actualizá el estado de los pedidos del local.
          </p>
        </div>
      </div>

      {/* Searchbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Fecha desde */}
          <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
              className="bg-transparent text-sm text-stone-900 outline-none w-32"
              title="Fecha desde"
            />
          </div>
          <span className="text-stone-400 text-sm pb-2">—</span>
          {/* Fecha hasta */}
          <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
              className="bg-transparent text-sm text-stone-900 outline-none w-32"
              title="Fecha hasta"
            />
          </div>

          {/* Usuario */}
          <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="bg-transparent text-sm text-stone-900 outline-none w-28 placeholder:text-stone-400"
            />
          </div>

          {/* Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="h-9 rounded-lg border border-orange-200 px-3 text-sm text-stone-900 bg-white focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none"
          >
            {ESTADOS_FILTRO.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Limpiar filtros */}
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 w-full">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-gray-400">Cargando pedidos...</p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-500">
            Error al cargar pedidos. Verificá que el servidor esté corriendo.
          </p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 font-medium">
                {filteredPedidos.length} pedido{filteredPedidos.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse min-w-[1100px]">
                <thead className="bg-orange-50 text-stone-900 text-xs uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4 text-center">ID</th>
                    <th className="py-3 px-4 text-center">Usuario</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-center">Subtotal</th>
                    <th className="py-3 px-4 text-center">Envío</th>
                    <th className="py-3 px-4 text-center">Descuento</th>
                    <th className="py-3 px-4 text-center">Total</th>
                    <th className="py-3 px-4 text-center">Forma Pago</th>
                    <th className="py-3 px-4 text-center">Dirección</th>
                    <th className="py-3 px-4 text-center">Fecha</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredPedidos.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 px-4 text-center text-sm text-gray-400 border-b border-orange-100">
                        No se encontraron pedidos.
                      </td>
                    </tr>
                  ) : (
                    filteredPedidos.map((pedido) => (
                      <tr key={pedido.id} className="transition hover:bg-orange-50">
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center font-medium">
                          #{pedido.id}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                          {usuarioMap[pedido.usuario_id]
                            ? `${usuarioMap[pedido.usuario_id]!.nombre} ${usuarioMap[pedido.usuario_id]!.apellido}`
                            : `#${pedido.usuario_id}`}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-center">
                          <CambiarEstadoDropdown
                            pedidoId={pedido.id}
                            estadoActual={pedido.estado_codigo}
                            onSuccess={() => queryClient.invalidateQueries({ queryKey: PEDIDOS_ADMIN_KEY })}
                          />
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                          ${Number(pedido.subtotal).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                          ${Number(pedido.costo_envio).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                          ${Number(pedido.descuento).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center font-bold">
                          ${Number(pedido.total).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                          {ETIQUETAS_PAGO[pedido.forma_pago_codigo.toUpperCase()] ?? pedido.forma_pago_codigo}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                          {pedido.direccion_id ? `#${pedido.direccion_id}` : "—"}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-stone-500 text-xs text-center whitespace-nowrap">
                          {formatearFecha(pedido.created_at)}
                        </td>
                        <td className="py-4 px-4 border-b border-orange-100 text-center">
                          <button
                            onClick={() => setPedidoDetalle(pedido)}
                            className="text-gray-400 hover:text-stone-900 transition-colors"
                            title="Ver detalle"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 border-t border-orange-100 pt-6">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-orange-50 disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500">Página {page + 1}</span>
              <button
                disabled={pedidos.length < PAGE_SIZE}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-orange-50 disabled:opacity-50 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal detalle */}
      {pedidoDetalle && (
        <DetallePedidoModal
          pedido={pedidoDetalle}
          usuarioMap={usuarioMap}
          onClose={() => setPedidoDetalle(null)}
        />
      )}
    </div>
  );
}
