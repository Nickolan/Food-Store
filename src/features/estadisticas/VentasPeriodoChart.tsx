import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { VentasPeriodoItem } from "../../models/Estadisticas";

interface Props {
  datos: VentasPeriodoItem[];
}

export default function VentasPeriodoChart({ datos }: Props) {
  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-stone-400">
        Sin datos para el período seleccionado.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={datos} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
        <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === "total_ventas") {
              const numero = Number(value);
              const formateado = isNaN(numero) ? "0.00" : numero.toFixed(2);
              return [`$${formateado}`, "Ventas ($)"];
            }
            return [value, "Pedidos"];
          }}
        />
        <Legend
          formatter={(value) =>
            value === "total_ventas" ? "Ventas ($)" : "Pedidos"
          }
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="total_ventas"
          stroke="#ea580c"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cantidad_pedidos"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
