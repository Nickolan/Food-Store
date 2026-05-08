import axios from "axios";
import type { Categoria } from "../models/Categoria";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const getCategorias = async () => {
  const response = await api.get<{ total: number; items: Categoria[] }>("/categorias/");
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
  await api.delete(`/categorias/${id}`);
};
