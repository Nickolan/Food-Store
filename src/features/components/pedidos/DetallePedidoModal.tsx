import { useEffect, useState } from "react";
import type { PedidoRead, DetallePedidoRead, HistorialEstadoPedidoRead } from "../../../models/Pedido";
import { getHistorialPedido } from "../../../api/pedidosApi";

const BADGE_CLASSES: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  EN_PREP: "bg-purple-100 text-purple-800",
  EN_CAMINO: "bg-cyan-100 text-cyan-800",
  ENTREGADO: "bg-emerald-100 text-emerald-700",
  CANCELADO: "bg-red-100 text-red-700",
};

const ETIQUETAS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP: "En preparación",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

interface Props {
  pedido: PedidoRead;
  onClose: () => void;
}

export default function DetallePedidoModal({ pedido, onClose }: Props) {
  const [historial, setHistorial] = useState<HistorialEstadoPedidoRead[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);

  useEffect(() => {
    getHistorialPedido(pedido.id)
      .then(setHistorial)
      .catch(() => {})
      .finally(() => setCargandoHistorial(false));
  }, [pedido.id]);

  const badgeClass = BADGE_CLASSES[pedido.estado_codigo.toUpperCase()] ?? "bg-gray-100 text-gray-700";
  const etiquetaEstado = ETIQUETAS[pedido.estado_codigo.toUpperCase()] ?? pedido.estado_codigo;

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-lg border border-orange-100 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-orange-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Pedido #{pedido.id}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                {etiquetaEstado}
              </span>
              <span className="text-xs text-stone-400">{formatearFecha(pedido.created_at)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-stone-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info del pedido */}
        <div className="p-6 grid grid-cols-2 gap-4 text-sm border-b border-orange-100">
          <div>
            <span className="text-stone-400">Usuario ID</span>
            <p className="text-stone-900 font-medium">{pedido.usuario_id}</p>
          </div>
          <div>
            <span className="text-stone-400">Forma de pago</span>
            <p className="text-stone-900 font-medium">{pedido.forma_pago_codigo}</p>
          </div>
          <div>
            <span className="text-stone-400">Dirección</span>
            <p className="text-stone-900 font-medium">{pedido.direccion_id ? `#${pedido.direccion_id}` : "—"}</p>
          </div>
          <div>
            <span className="text-stone-400">Notas</span>
            <p className="text-stone-900 font-medium">{pedido.notas || "—"}</p>
          </div>
        </div>

        {/* Totales */}
        <div className="p-6 border-b border-orange-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-stone-400">Subtotal</span>
              <p className="text-stone-900 font-medium">${Number(pedido.subtotal).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-stone-400">Costo envío</span>
              <p className="text-stone-900 font-medium">${Number(pedido.costo_envio).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-stone-400">Descuento</span>
              <p className="text-stone-900 font-medium">${Number(pedido.descuento).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-stone-400">Total</span>
              <p className="text-lg font-bold text-orange-600">${Number(pedido.total).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Detalle de productos */}
        <div className="p-6 border-b border-orange-100">
          <h3 className="text-sm font-bold text-stone-900 uppercase mb-3">Productos</h3>
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-stone-900 text-xs uppercase font-bold">
              <tr>
                <th className="py-2 px-3 text-left">Producto</th>
                <th className="py-2 px-3 text-center">Cant.</th>
                <th className="py-2 px-3 text-right">Precio</th>
                <th className="py-2 px-3 text-right">Subtotal</th>
                <th className="py-2 px-3 text-center">Personalización</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalle.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400">Sin productos</td>
                </tr>
              ) : (
                pedido.detalle.map((item: DetallePedidoRead, i: number) => (
                  <tr key={i} className="border-b border-orange-50 hover:bg-orange-50">
                    <td className="py-2 px-3 text-stone-900">{item.nombre_snapshot}</td>
                    <td className="py-2 px-3 text-stone-900 text-center">{item.cantidad}</td>
                    <td className="py-2 px-3 text-stone-900 text-right">${Number(item.precio_snapshot).toFixed(2)}</td>
                    <td className="py-2 px-3 text-stone-900 text-right font-medium">${Number(item.subtotal_snap).toFixed(2)}</td>
                    <td className="py-2 px-3 text-center text-stone-500 text-xs">
                      {item.personalizacion && item.personalizacion.length > 0
                        ? `Sin ${item.personalizacion.length} ingrediente(s)`
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Historial de estados */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase mb-3">Historial de estados</h3>
          {cargandoHistorial ? (
            <p className="text-sm text-gray-400 text-center py-4">Cargando historial...</p>
          ) : historial.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Sin historial disponible.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-orange-50 text-stone-900 text-xs uppercase font-bold">
                <tr>
                  <th className="py-2 px-3 text-left">Anterior</th>
                  <th className="py-2 px-3 text-left">Nuevo</th>
                  <th className="py-2 px-3 text-left">Fecha</th>
                  <th className="py-2 px-3 text-center">Usuario ID</th>
                  <th className="py-2 px-3 text-left">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={i} className="border-b border-orange-50 hover:bg-orange-50">
                    <td className="py-2 px-3 text-stone-600">
                      {h.estado_desde ? (ETIQUETAS[h.estado_desde.toUpperCase()] ?? h.estado_desde) : "—"}
                    </td>
                    <td className="py-2 px-3 text-stone-900 font-medium">
                      {ETIQUETAS[h.estado_hacia.toUpperCase()] ?? h.estado_hacia}
                    </td>
                    <td className="py-2 px-3 text-stone-500 text-xs">{formatearFecha(h.created_at)}</td>
                    <td className="py-2 px-3 text-stone-600 text-center">{h.usuario_id ?? "—"}</td>
                    <td className="py-2 px-3 text-stone-500 text-xs">{h.motivo || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
