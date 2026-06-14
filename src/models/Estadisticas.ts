export interface ResumenKPIs {
  ventas_hoy: number;
  ticket_promedio: number;
  pedidos_activos: number;
  ingresos_mes: number;
}

export interface VentasPeriodoItem {
  periodo: string;
  total_ventas: number;
  cantidad_pedidos: number;
}

export interface ProductoTopItem {
  nombre: string;
  ingresos: number;
  cantidad_vendida: number;
}

export interface PedidosEstadoItem {
  estado_codigo: string;
  cantidad: number;
}

export interface IngresosItem {
  forma_pago_codigo: string;
  total: number;
  cantidad: number;
}

export type Agrupacion = "day" | "week" | "month";
