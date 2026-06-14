import axios from "axios";
import type { UnidadMedida } from "../models/Unidad_medida";
import { env } from '../config/env';

const api = axios.create({ baseURL: env.API_BASE_URL, withCredentials: true });

export interface UnidadMedidaPaginadoResponse {
  total: number;
  items: UnidadMedida[];
}

export const getUnidadesMedida = async (): Promise<UnidadMedidaPaginadoResponse> => {
  const response = await api.get<UnidadMedidaPaginadoResponse>("/unidades-medida/");
  return response.data;
};