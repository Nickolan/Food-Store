import axios from "axios";
import type { Categoria } from "../models/Categoria";
import { env } from '../config/env';

const api = axios.create({ baseURL: env.API_BASE_URL, withCredentials: true  });

export const getCategorias = async ({limit = 100, offset = 0, nombre = ""}: { limit?: number; offset?: number; nombre?: string }) => {
  const response = await api.get<{ total: number; items: Categoria[] }>(`/categorias/?limit=${limit}&offset=${offset}&nombre=${nombre || ''}`);
  return response.data.items;
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
