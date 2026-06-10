export interface DetallePedidoRead {
  producto_id: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: string;
  subtotal_snap: string;
  personalizacion?: number[] | null;
}

export interface PedidoRead {
  id: number;
  usuario_id: number;
  estado_codigo: string;
  subtotal: string;
  total: string;
  direccion_id?: number | null;
  forma_pago_codigo: string;
  descuento: string;
  costo_envio: string;
  notas?: string | null;
  created_at?: string | null;
  detalle: DetallePedidoRead[];
}

export interface PedidoUpdate {
  estado_codigo: string;
  motivo?: string | null;
}

export interface HistorialEstadoPedidoRead {
  pedido_id: number;
  estado_desde?: string | null;
  estado_hacia: string;
  usuario_id?: number | null;
  motivo?: string | null;
  created_at: string;
}
