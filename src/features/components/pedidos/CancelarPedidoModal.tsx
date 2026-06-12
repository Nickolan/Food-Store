import { useState } from "react";
import { cancelarPedido } from "../../../api/pedidosApi";
import toast from "react-hot-toast";

interface Props {
  pedidoId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancelarPedidoModal({ pedidoId, onClose, onSuccess }: Props) {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    if (!motivo.trim()) {
      toast.error("El motivo de cancelación es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await cancelarPedido(pedidoId, motivo.trim());
      toast.success("Pedido cancelado correctamente.");
      onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Error al cancelar el pedido.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-stone-900 mb-2">Cancelar Pedido #{pedidoId}</h2>
        <p className="text-sm text-stone-500 mb-4">
          Ingresá el motivo por el que se cancela el pedido.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo de cancelación..."
          rows={3}
          className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm text-stone-900 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none resize-none"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-orange-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-orange-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Cancelando..." : "Confirmar cancelación"}
          </button>
        </div>
      </div>
    </div>
  );
}
