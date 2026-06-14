import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { PedidosEstadoItem } from "../../models/Estadisticas";

interface Props {
  datos: PedidosEstadoItem[];
}

const COLORES_ESTADO: Record<string, string> = {
  PENDIENTE:  "#f59e0b",
  CONFIRMADO: "#3b82f6",
  EN_PREP:    "#f97316",
  EN_CAMINO:  "#8b5cf6",
  ENTREGADO:  "#22c55e",
  CANCELADO:  "#9ca3af",
};

const COLOR_DEFAULT = "#cbd5e1";

const ETIQUETAS: Record<string, string> = {
  PENDIENTE:  "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP:    "En preparación",
  EN_CAMINO:  "En camino",
  ENTREGADO:  "Entregado",
  CANCELADO:  "Cancelado",
};

export default function PedidosEstadoChart({ datos }: Props) {
  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-stone-400">
        Sin pedidos registrados.
      </div>
    );
  }

  const datosConEtiqueta = datos.map((d) => ({
    ...d,
    name: ETIQUETAS[d.estado_codigo] ?? d.estado_codigo,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={datosConEtiqueta}
          dataKey="cantidad"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {datosConEtiqueta.map((entry) => (
            <Cell
              key={entry.estado_codigo}
              fill={COLORES_ESTADO[entry.estado_codigo] ?? COLOR_DEFAULT}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [value, "Pedidos"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
