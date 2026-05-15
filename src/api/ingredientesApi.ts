// api/ingredientesApi.ts
import axios from "axios";
import type { Ingrediente } from "../models/Ingrediente";

const api = axios.create({ baseURL: "http://localhost:8000" });

export interface IngredientePaginadoResponse {
  total: number;
  items: Ingrediente[];
}

export interface IngredienteFilter {
  nombre?: string;
  offset?: number;
  limit?: number;
}

export const getIngredientes = async (
  filters?: IngredienteFilter
): Promise<IngredientePaginadoResponse> => {
  const params: Record<string, string> = {};
  if (filters?.nombre) params["nombre"] = filters.nombre;
  if (filters?.offset !== undefined) params["offset"] = String(filters.offset);
  if (filters?.limit !== undefined) params["limit"] = String(filters.limit);

  const response = await api.get<IngredientePaginadoResponse>("/ingredientes/", { params });
  return response.data;
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const response = await api.get<Ingrediente>(`/ingredientes/${id}`);
  return response.data;
};

export const createIngrediente = async (
  ingrediente: Omit<Ingrediente, "id">
): Promise<Ingrediente> => {
  const response = await api.post<Ingrediente>("/ingredientes/", ingrediente);
  return response.data;
};

export const updateIngrediente = async (
  id: number,
  ingrediente: Partial<Omit<Ingrediente, "id">>
): Promise<Ingrediente> => {
  const response = await api.put<Ingrediente>(`/ingredientes/${id}`, ingrediente);
  return response.data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`);
};