import axios from "axios";
import type { PedidoUpdate, HistorialEstadoPedidoRead } from "../models/Pedido";
import { env } from '../config/env';
const api = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

export interface DetalleCreate {
  producto_id: number;
  cantidad: number;
  personalizacion?: number[];
}

export interface PedidoCreate {
  forma_pago_codigo: string;
  direccion_id?: number | null;
  descuento?: number;
  costo_envio?: number;
  notas?: string;
  items: DetalleCreate[];
}

export interface DetalleRead {
  producto_id: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  subtotal_snap: number;
  personalizacion?: number[] | null;
}

export interface PedidoRead {
  id: number;
  usuario_id: number;
  estado_codigo: string;
  forma_pago_codigo: string;
  direccion_id?: number | null;
  subtotal: number;
  total: number;
  descuento: number;
  costo_envio: number;
  notas?: string | null;
  detalle: DetalleRead[];
  created_at?: string;
  updated_at?: string;
}

export async function crearPedido(data: PedidoCreate): Promise<PedidoRead> {
  const response = await api.post<PedidoRead>("/pedidos/", data);
  return response.data;
}

export async function obtenerPedidos(skip = 0, limit = 100): Promise<PedidoRead[]> {
  const response = await api.get<PedidoRead[]>("/pedidos/", { params: { skip, limit } });
  return response.data;
}

export async function obtenerPedidoPorId(id: number): Promise<PedidoRead> {
  const response = await api.get<PedidoRead>(`/pedidos/${id}`);
  return response.data;
}

export async function cancelarPedido(id: number, motivo: string): Promise<void> {
  await api.delete(`/pedidos/${id}`, { params: { motivo } });
}

export interface GetPedidosParams {
  skip?: number;
  limit?: number;
}

export async function getPedidos(params?: GetPedidosParams): Promise<PedidoRead[]> {
  const response = await api.get<PedidoRead[]>("/pedidos/", { params });
  return response.data;
}

export async function getPedidoById(id: number): Promise<PedidoRead> {
  const response = await api.get<PedidoRead>(`/pedidos/${id}`);
  return response.data;
}

export async function actualizarEstado(id: number, data: PedidoUpdate): Promise<PedidoRead> {
  const response = await api.put<PedidoRead>(`/pedidos/${id}`, data);
  return response.data;
}

export async function getHistorialPedido(id: number): Promise<HistorialEstadoPedidoRead[]> {
  const response = await api.get<HistorialEstadoPedidoRead[]>(`/pedidos/${id}/historial`);
  return response.data;
}
