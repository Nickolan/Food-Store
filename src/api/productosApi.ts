import axios from "axios";
import type { Producto, ProductoCreate, ProductoUpdate, ProductoReadFull } from "../models/Producto";

const api = axios.create({ baseURL: "http://localhost:8000" });

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

export const getProductos = async (
  filters?: ProductoFilter
): Promise<ProductoPaginadoResponse> => {
  const params: Record<string, string> = {};
  if (filters?.nombre) params["nombre"] = filters.nombre;
  if (filters?.activo !== undefined) params["activo"] = String(filters.activo);
  if (filters?.offset !== undefined) params["offset"] = String(filters.offset);
  if (filters?.limit !== undefined) params["limit"] = String(filters.limit);

  const response = await api.get<ProductoPaginadoResponse>("/productos/", { params });
  return response.data;
};

export const getProductoById = async (id: number): Promise<ProductoReadFull> => {
  const response = await api.get<ProductoReadFull>(`/productos/${id}`);
  return response.data;
};

export const createProducto = async (
  producto: ProductoCreate
): Promise<Producto> => {
  const response = await api.post<Producto>("/productos/", producto);
  return response.data;
};

export const updateProducto = async (
  id: number,
  producto: ProductoUpdate
): Promise<Producto> => {
  const response = await api.put<Producto>(`/productos/${id}`, producto);
  return response.data;
};

export const desactivarProducto = async (id: number): Promise<Producto> => {
  const response = await api.put<Producto>(`/productos/${id}/desactivar`);
  return response.data;
};

export const addIngredienteToProducto = async (
  productoId: number,
  ingredienteId: number,
  esRemovible: boolean
): Promise<Producto> => {
  const response = await api.post<Producto>(`/productos/${productoId}/ingredientes`, {
    ingrediente_id: ingredienteId,
    es_removible: esRemovible
  });
  return response.data;
};

export const updateIngredienteRemovible = async (
  productoId: number,
  ingredienteId: number,
  esRemovible: boolean
): Promise<Producto> => {
  const response = await api.put<Producto>(
    `/productos/${productoId}/ingredientes/${ingredienteId}?es_removible=${esRemovible}`
  );
  return response.data;
};

export const removeIngredienteFromProducto = async (
  productoId: number,
  ingredienteId: number
): Promise<Producto> => {
  const response = await api.delete<Producto>(`/productos/${productoId}/ingredientes/${ingredienteId}`);
  return response.data;
};

export const reactivarProducto = async (id: number): Promise<Producto> => {
  const response = await api.put<Producto>(`/productos/${id}/reactivar`);
  return response.data;
};