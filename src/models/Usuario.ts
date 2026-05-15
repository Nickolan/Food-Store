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
    access_token: string;
    token_type: string;
    expires_in: number;
    mensaje: string;
    usuario: Usuario;
}
