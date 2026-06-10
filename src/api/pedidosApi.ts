import axios from "axios";
import type { PedidoRead, PedidoUpdate, HistorialEstadoPedidoRead } from "../models/Pedido";

const api = axios.create({ baseURL: "http://localhost:8000/pedidos", withCredentials: true });

export interface GetPedidosParams {
  skip?: number;
  limit?: number;
}

export async function getPedidos(params?: GetPedidosParams): Promise<PedidoRead[]> {
  const response = await api.get<PedidoRead[]>("/", { params });
  return response.data;
}

export async function getPedidoById(id: number): Promise<PedidoRead> {
  const response = await api.get<PedidoRead>(`/${id}`);
  return response.data;
}

export async function actualizarEstado(id: number, data: PedidoUpdate): Promise<PedidoRead> {
  const response = await api.put<PedidoRead>(`/${id}`, data);
  return response.data;
}

export async function getHistorialPedido(id: number): Promise<HistorialEstadoPedidoRead[]> {
  const response = await api.get<HistorialEstadoPedidoRead[]>(`/${id}/historial`);
  return response.data;
}

export async function cancelarPedido(id: number, motivo: string): Promise<void> {
  await api.delete(`/${id}`, { params: { motivo } });
}
