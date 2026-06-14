import axios from "axios";

const api = axios.create({ 
    baseURL: "http://localhost:8000/api/v1", 
    withCredentials: true 
});

export interface Direccion {
  id: number;
  usuario_id: number;
  alias: string | null;
  linea1: string;
  linea2: string | null;
  ciudad: string;
  provincia: string | null;
  codigo_postal: string;
  latitud: number | null;
  longitud: number | null;
  es_principal: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CrearDireccionDTO {
  alias?: string;
  linea1: string;
  linea2?: string;
  ciudad: string;
  provincia?: string;
  codigo_postal: string;
  latitud?: number;
  longitud?: number;
  es_principal?: boolean;
}

export interface ActualizarDireccionDTO {
  alias?: string;
  linea1?: string;
  linea2?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  latitud?: number;
  longitud?: number;
  es_principal?: boolean;
}

export const direccionesApi = {
  // Obtener dirección por ID (sin filtro de ownership — solo ADMIN/PEDIDOS)
  obtenerAdmin: async (id: number): Promise<Direccion> => {
    const response = await api.get(`/direcciones/admin/${id}`);
    return response.data;
  },

  // Crear nueva dirección
  crear: async (data: CrearDireccionDTO): Promise<Direccion> => {
    const response = await api.post('/direcciones/', data);
    return response.data;
  },

  // Listar todas mis direcciones
  listar: async (): Promise<Direccion[]> => {
    const response = await api.get('/direcciones/');
    return response.data;
  },

  // Obtener una dirección específica
  obtener: async (id: number): Promise<Direccion> => {
    const response = await api.get(`/direcciones/${id}`);
    return response.data;
  },

  // Actualizar dirección
  actualizar: async (id: number, data: ActualizarDireccionDTO): Promise<Direccion> => {
    const response = await api.put(`/direcciones/${id}`, data);
    return response.data;
  },

  // Marcar como principal
  marcarPrincipal: async (direccionId: number): Promise<Direccion> => {
    const response = await api.patch('/direcciones/principal', { direccion_id: direccionId });
    return response.data;
  },

  // Eliminar dirección
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/direcciones/${id}`);
  },
};