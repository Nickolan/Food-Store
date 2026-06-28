import axios from "axios";
import type { Categoria } from "../models/Categoria";
import { env } from '../config/env';

const api = axios.create({ baseURL: env.API_BASE_URL, withCredentials: true  });

export const getCategorias = async ({
  limit = 100,
  offset = 0,
  nombre = "",
  activo,
  parent_id,
  solo_raiz,
}: {
  limit?: number;
  offset?: number;
  nombre?: string;
  activo?: boolean;
  parent_id?: number | null;
  solo_raiz?: boolean;
}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  if (nombre) params.set("nombre", nombre);
  if (activo !== undefined) params.set("activo", String(activo));
  if (solo_raiz) params.set("solo_raiz", "true");
  else if (parent_id !== undefined && parent_id !== null) params.set("parent_id", String(parent_id));
  const response = await api.get<{ total: number; items: Categoria[] }>(`/categorias/?${params}`);
  return { total: response.data.total, items: response.data.items };
};

export const getCategoriaById = async (id: number) => {
  const response = await api.get<Categoria>(`/categorias/${id}`);
  return response.data;
};

export const createCategoria = async (categoria: Categoria) => {
  const response = await api.post<Categoria>("/categorias/", categoria);
  return response.data;
};

export const updateCategoria = async (id: number, categoria: Partial<Categoria>) => {
  const response = await api.put<Categoria>(`/categorias/${id}`, categoria);
  return response.data;
};

export const deleteCategoria = async (id: number) => {
  await api.put(`/categorias/${id}/desactivar`);
};
