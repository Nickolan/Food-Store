import axios from "axios";
import type { Producto } from "../models/Producto";

const api = axios.create({ baseURL: "http://localhost:8000" });

// ─── Tipos de respuesta del server ───────────────────────────────────────────

export interface ProductoPaginadoResponse {
  total: number;
  items: Producto[];
}

export interface ProductoFilter {
  nombre?: string;
  activo?: boolean;
  offset?: number;
  limit?: number;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

export const getProductos = async (
  filters?: ProductoFilter
): Promise<ProductoPaginadoResponse> => {
  const params: Record<string, string> = {};
  if (filters?.nombre) params["nombre"] = filters.nombre;
  if (filters?.activo !== undefined) params["activo"] = String(filters.activo);
  if (filters?.offset !== undefined) params["offset"] = String(filters.offset);
  if (filters?.limit !== undefined) params["limit"] = String(filters.limit);

  const response = await api.get<ProductoPaginadoResponse>("/productos", { params });
  return response.data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const response = await api.get<Producto>(`/productos/${id}`);
  return response.data;
};

export const createProducto = async (
  producto: Omit<Producto, "id" | "activo">
): Promise<Producto> => {
  const response = await api.post<Producto>("/productos", producto);
  return response.data;
};

export const updateProducto = async (
  id: number,
  producto: Partial<Omit<Producto, "id" | "activo">>
): Promise<Producto> => {
  const response = await api.put<Producto>(`/productos/${id}`, producto);
  return response.data;
};

// Baja lógica — PUT /{id}/desactivar (según el router del server)
export const desactivarProducto = async (id: number): Promise<Producto> => {
  const response = await api.put<Producto>(`/productos/${id}/desactivar`);
  return response.data;
};
