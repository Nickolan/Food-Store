import axios from "axios";
import type { UnidadMedida } from "../models/Unidad_medida";

const api = axios.create({ baseURL: "http://localhost:8000", withCredentials: true });

export interface UnidadMedidaPaginadoResponse {
  total: number;
  items: UnidadMedida[];
}

export const getUnidadesMedida = async (): Promise<UnidadMedidaPaginadoResponse> => {
  const response = await api.get<UnidadMedidaPaginadoResponse>("/unidades-medida/");
  return response.data;
};