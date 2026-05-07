export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    celular?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    mensaje: string;
    usuario: Usuario;
}
