import axios from "axios";
import type {
  ResumenKPIs,
  VentasPeriodoItem,
  ProductoTopItem,
  PedidosEstadoItem,
  IngresosItem,
  Agrupacion,
} from "../models/Estadisticas";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export async function getResumen(): Promise<ResumenKPIs> {
  const { data } = await api.get<ResumenKPIs>("/estadisticas/resumen");
  return data;
}

export async function getVentas(
  desde: string,
  hasta: string,
  agrupacion: Agrupacion = "day"
): Promise<VentasPeriodoItem[]> {
  const { data } = await api.get<VentasPeriodoItem[]>("/estadisticas/ventas", {
    params: { desde, hasta, agrupacion },
  });
  return data;
}

export async function getProductosTop(limit = 10): Promise<ProductoTopItem[]> {
  const { data } = await api.get<ProductoTopItem[]>("/estadisticas/productos-top", {
    params: { limit },
  });
  return data;
}

export async function getPedidosPorEstado(): Promise<PedidosEstadoItem[]> {
  const { data } = await api.get<PedidosEstadoItem[]>("/estadisticas/pedidos-por-estado");
  return data;
}

export async function getIngresos(desde: string, hasta: string): Promise<IngresosItem[]> {
  const { data } = await api.get<IngresosItem[]>("/estadisticas/ingresos", {
    params: { desde, hasta },
  });
  return data;
}
