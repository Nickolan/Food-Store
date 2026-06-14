import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ProductoTopItem } from "../../models/Estadisticas";

interface Props {
  datos: ProductoTopItem[];
}

function truncar(str: string, max = 14): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function ProductosTopChart({ datos }: Props) {
  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-stone-400">
        Sin productos para mostrar.
      </div>
    );
  }

  const datosConNombreCorto = datos.map((d) => ({
    ...d,
    nombre_corto: truncar(d.nombre),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={datosConNombreCorto} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
        <XAxis dataKey="nombre_corto" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === "ingresos") {
              const numero = Number(value);
              const formateado = isNaN(numero) ? "0.00" : numero.toFixed(2);
              return [`$${formateado}`, "Ingresos"];
            }
            return [value, "Unidades"];
          }}
          labelFormatter={(label) => {
            const item = datos.find((d) => truncar(d.nombre) === label);
            return item?.nombre ?? label;
          }}
        />
        <Bar dataKey="ingresos" fill="#ea580c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
