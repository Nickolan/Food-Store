import axios from "axios";
import type { Usuario } from "../models/Usuario";
import { env } from '../config/env';

const api = axios.create({ 
    baseURL: env.API_BASE_URL + "/auth", 
    withCredentials: true 
});

export interface ActualizarUsuarioDTO {
  nombre?: string;
  apellido?: string;
  celular?: string;
}

export interface UsuariosPaginados {
  total: number;
  items: Usuario[];
}

export const usuarioApi = {
  actualizarPerfil: async (data: ActualizarUsuarioDTO): Promise<any> => {
    const response = await api.put('/me', data);
    return response.data;
  },

  // ─── Endpoints de administración ───────────────────────────────────────────

  listarUsuarios: async (offset = 0, limit = 10, nombre?: string, disabled?: boolean): Promise<UsuariosPaginados> => {
    const response = await api.get<UsuariosPaginados>('/', { params: { offset, limit, nombre: nombre || undefined, disabled } });
    return response.data;
  },

  desactivarUsuario: async (id: number): Promise<Usuario> => {
    const response = await api.delete<Usuario>(`/${id}`);
    return response.data;
  },

  reactivarUsuario: async (id: number): Promise<Usuario> => {
    const response = await api.patch<Usuario>(`/${id}/activar`);
    return response.data;
  },
};