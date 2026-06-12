import { useState, useRef, useEffect } from "react";
import { actualizarEstado } from "../../../api/pedidosApi";
import CancelarPedidoModal from "./CancelarPedidoModal";
import toast from "react-hot-toast";

const TRANSICIONES: Record<string, string[]> = {
  PENDIENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["EN_PREP", "CANCELADO"],
  EN_PREP: ["EN_CAMINO", "CANCELADO"],
  EN_CAMINO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

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
  pedidoId: number;
  estadoActual: string;
  onSuccess: () => void;
}

interface Coordenadas {
  top: number;
  left: number;
  height: number;
}

export default function CambiarEstadoDropdown({ pedidoId, estadoActual, onSuccess }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [mostrarCancelModal, setMostrarCancelModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [coords, setCoords] = useState<Coordenadas | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  const codigo = estadoActual.toUpperCase();
  const transiciones = TRANSICIONES[codigo] ?? [];
  const badgeClass = BADGE_CLASSES[codigo] ?? "bg-gray-100 text-gray-700";
  const etiqueta = ETIQUETAS[codigo] ?? codigo;

  // Calcular coordenadas al abrir
  const abrirDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        height: rect.height
      });
      setAbierto(true);
    }
  };

  const cerrarDropdown = () => {
    setAbierto(false);
    setCoords(null);
  };

  // Cerrar al hacer scroll
  useEffect(() => {
    if (!abierto) return;
    
    const handleScroll = () => {
      cerrarDropdown();
    };
    
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [abierto]);

  // Cerrar al redimensionar
  useEffect(() => {
    if (!abierto) return;
    
    const handleResize = () => {
      cerrarDropdown();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [abierto]);

  const handleSeleccionar = async (nuevoEstado: string) => {
    cerrarDropdown();

    if (nuevoEstado === "CANCELADO") {
      setMostrarCancelModal(true);
      return;
    }

    const confirmacion = confirm(
      `¿Estás seguro de cambiar el pedido #${pedidoId} de "${etiqueta}" a "${ETIQUETAS[nuevoEstado] ?? nuevoEstado}"?`
    );
    if (!confirmacion) return;

    setCargando(true);
    try {
      await actualizarEstado(pedidoId, { estado_codigo: nuevoEstado });
      toast.success(`Pedido #${pedidoId} → ${ETIQUETAS[nuevoEstado] ?? nuevoEstado}`);
      onSuccess();
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Error al cambiar el estado.";
      toast.error(detail);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          onClick={() => {
            if (abierto) {
              cerrarDropdown();
            } else {
              abrirDropdown();
            }
          }}
          disabled={transiciones.length === 0 || cargando}
          title={
            transiciones.length === 0
              ? "Estado terminal, no se puede cambiar"
              : `Cambiar estado (${transiciones.join(", ")})`
          }
          className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 ${
            transiciones.length > 0
              ? "hover:ring-2 hover:ring-orange-400 hover:ring-offset-1"
              : "cursor-not-allowed"
          } ${badgeClass} transition-all`}
        >
          {cargando ? "..." : etiqueta}
        </button>
      </div>

      {/* Dropdown con position fixed */}
      {abierto && transiciones.length > 0 && coords && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={cerrarDropdown}
            style={{ backgroundColor: 'rgba(0,0,0,0)' }}
          />
          <div 
            className="fixed z-50 bg-white border border-orange-100 rounded-lg shadow-lg py-1 min-w-[140px]"
            style={{
              top: `${coords.top + (coords.height / 2) - 5}px`,
              left: `${coords.left}px`,
              transform: 'translateY(-50%)'
            }}
          >
            {transiciones.map((estado) => (
              <button
                key={estado}
                onClick={() => handleSeleccionar(estado)}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-orange-50 ${
                  estado === "CANCELADO" ? "text-red-600" : "text-stone-700"
                }`}
              >
                {ETIQUETAS[estado] ?? estado}
              </button>
            ))}
          </div>
        </>
      )}

      {mostrarCancelModal && (
        <CancelarPedidoModal
          pedidoId={pedidoId}
          onClose={() => setMostrarCancelModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}