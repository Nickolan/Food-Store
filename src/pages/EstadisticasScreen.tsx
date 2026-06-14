import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getResumen,
  getVentas,
  getProductosTop,
  getPedidosPorEstado,
  getIngresos,
} from "../api/estadisticasApi";
import type { Agrupacion } from "../models/Estadisticas";
import StatCard from "../features/estadisticas/StatCard";
import VentasPeriodoChart from "../features/estadisticas/VentasPeriodoChart";
import ProductosTopChart from "../features/estadisticas/ProductosTopChart";
import PedidosEstadoChart from "../features/estadisticas/PedidosEstadoChart";
import IngresosPagoChart from "../features/estadisticas/IngresosPagoChart";

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function primerDiaMes(): string {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
}

export default function EstadisticasScreen() {
  const [desde, setDesde] = useState(primerDiaMes());
  const [hasta, setHasta] = useState(fechaHoy());
  const [agrupacion, setAgrupacion] = useState<Agrupacion>("day");

  const { data: resumen, isLoading: cargandoResumen } = useQuery({
    queryKey: ["estadisticas", "resumen"],
    queryFn: getResumen,
  });

  const { data: ventas = [], isLoading: cargandoVentas } = useQuery({
    queryKey: ["estadisticas", "ventas", desde, hasta, agrupacion],
    queryFn: () => getVentas(desde, hasta, agrupacion),
    enabled: !!desde && !!hasta,
  });

  const { data: productosTop = [], isLoading: cargandoProductos } = useQuery({
    queryKey: ["estadisticas", "productos-top"],
    queryFn: () => getProductosTop(10),
  });

  const { data: pedidosEstado = [], isLoading: cargandoEstados } = useQuery({
    queryKey: ["estadisticas", "pedidos-por-estado"],
    queryFn: getPedidosPorEstado,
  });

  const { data: ingresos = [], isLoading: cargandoIngresos } = useQuery({
    queryKey: ["estadisticas", "ingresos", desde, hasta],
    queryFn: () => getIngresos(desde, hasta),
    enabled: !!desde && !!hasta,
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-6">
        <div>
          <h1 className="text-stone-900 text-2xl font-bold">Estadísticas</h1>
          <p className="text-stone-500 text-sm mt-1">
            KPIs y métricas del negocio en tiempo real.
          </p>
        </div>
      </div>

      {/* Filtro de período */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="bg-transparent text-sm text-stone-900 outline-none w-32"
            title="Fecha desde"
          />
        </div>
        <span className="text-stone-400 text-sm pb-1">—</span>
        <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="bg-transparent text-sm text-stone-900 outline-none w-32"
            title="Fecha hasta"
          />
        </div>
        <select
          value={agrupacion}
          onChange={(e) => setAgrupacion(e.target.value as Agrupacion)}
          className="h-9 rounded-lg border border-orange-200 px-3 text-sm text-stone-900 bg-white focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none"
        >
          <option value="day">Por día</option>
          <option value="week">Por semana</option>
          <option value="month">Por mes</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cargandoResumen ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 h-28 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              titulo="Ventas hoy"
              valor={`$${Number(resumen?.ventas_hoy ?? 0).toFixed(2)}`}
              descripcion="Pedidos no cancelados"
            />
            <StatCard
              titulo="Ticket promedio"
              valor={`$${Number(resumen?.ticket_promedio ?? 0).toFixed(2)}`}
              descripcion="Histórico general"
            />
            <StatCard
              titulo="Pedidos activos"
              valor={resumen?.pedidos_activos ?? 0}
              descripcion="En curso ahora"
            />
            <StatCard
              titulo="Ingresos del mes"
              valor={`$${Number(resumen?.ingresos_mes ?? 0).toFixed(2)}`}
              descripcion="Pedidos no cancelados"
            />
          </>
        )}
      </div>

      {/* Gráficos — fila 1 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Ventas por período (2/3) */}
        <div className="col-span-2 bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-stone-700 mb-4">Ventas por período</h2>
          {cargandoVentas ? (
            <div className="h-64 animate-pulse bg-orange-50 rounded-xl" />
          ) : (
            <VentasPeriodoChart datos={ventas} />
          )}
        </div>

        {/* Distribución por estado (1/3) */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-stone-700 mb-4">Pedidos por estado</h2>
          {cargandoEstados ? (
            <div className="h-64 animate-pulse bg-orange-50 rounded-xl" />
          ) : (
            <PedidosEstadoChart datos={pedidosEstado} />
          )}
        </div>
      </div>

      {/* Gráficos — fila 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top productos */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-stone-700 mb-4">Top 10 productos por ingresos</h2>
          {cargandoProductos ? (
            <div className="h-64 animate-pulse bg-orange-50 rounded-xl" />
          ) : (
            <ProductosTopChart datos={productosTop} />
          )}
        </div>

        {/* Ingresos por forma de pago */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-stone-700 mb-4">Ingresos por forma de pago</h2>
          {cargandoIngresos ? (
            <div className="h-64 animate-pulse bg-orange-50 rounded-xl" />
          ) : (
            <IngresosPagoChart datos={ingresos} />
          )}
        </div>
      </div>
    </div>
  );
}
