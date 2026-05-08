import axios from "axios";
import type { Categoria } from "../models/Categoria";

const api = axios.create({ baseURL: "http://localhost:8000" });

export interface CategoriaPaginadoResponse {
  total: number;
  items: Categoria[];
}

export const getCategorias = async (limit = 100): Promise<Categoria[]> => {
  const response = await api.get<CategoriaPaginadoResponse>("/categorias", {
    params: { limit, offset: 0 },
  });
  return response.data.items;
};
