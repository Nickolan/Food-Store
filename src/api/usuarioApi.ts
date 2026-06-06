import axios from "axios";

const api = axios.create({ 
    baseURL: "http://localhost:8000/api/v1/auth", 
    withCredentials: true 
});

export interface ActualizarUsuarioDTO {
  nombre?: string;
  apellido?: string;
  celular?: string;
}

export const usuarioApi = {
  actualizarPerfil: async (data: ActualizarUsuarioDTO): Promise<any> => {
    const response = await api.put('/me', data);
    return response.data;
  },
};