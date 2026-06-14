import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { IngresosItem } from "../../models/Estadisticas";

interface Props {
  datos: IngresosItem[];
}

const ETIQUETAS_PAGO: Record<string, string> = {
  MERCADOPAGO:   "Mercado Pago",
  EFECTIVO:      "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

export default function IngresosPagoChart({ datos }: Props) {
  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-stone-400">
        Sin pagos aprobados en el período seleccionado.
      </div>
    );
  }

  const datosConEtiqueta = datos.map((d) => ({
    ...d,
    nombre: ETIQUETAS_PAGO[d.forma_pago_codigo] ?? d.forma_pago_codigo,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={datosConEtiqueta}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="nombre" tick={{ fontSize: 12 }} width={75} />
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === "total") {
              const numero = Number(value);
              const formateado = isNaN(numero) ? "0.00" : numero.toFixed(2);
              return [`$${formateado}`, "Total"];
            }
            return [value, "Transacciones"];
          }}
        />
        <Bar dataKey="total" fill="#f97316" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
