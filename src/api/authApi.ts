import axios from "axios";
import type { LoginResponse, Usuario } from "../models/Usuario";

const api = axios.create({ baseURL: "http://localhost:8000/api/v1/auth", withCredentials: true });

export class AuthError extends Error {
    status: number;
    retryAfter?: number;

    constructor(message: string, status: number, retryAfter?: number) {
        super(message);
        this.name = "AuthError";
        this.status = status;
        this.retryAfter = retryAfter;
    }
}

export async function login(form_data: { email: string; password: string }): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>("/token", {
            email: form_data.email,
            password: form_data.password
        });
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const status = err.response.status;
            const detail = err.response.data?.detail || "Error inesperado";
            const retryAfter = err.response.headers?.["retry-after"] ?? err.response.headers?.["Retry-After"];
            const retryAfterNum = retryAfter ? parseInt(retryAfter, 10) : undefined;
            throw new AuthError(detail, status, retryAfterNum);
        }
        throw new AuthError("Error de conexión con el servidor", 0);
    }
}

export async function getMe(): Promise<Usuario> {
    const response = await api.get<Usuario>("/me");
    return response.data;
}

export async function logout(): Promise<void> {
    await api.post("/logout");
}

export async function signUpApi(form_data: { nombre: string; apellido: string; email: string; celular: string; password: string }): Promise<Usuario> {
    try {
        const response = await api.post<Usuario>("/", {
            nombre: form_data.nombre,
            apellido: form_data.apellido,
            email: form_data.email,
            celular: form_data.celular,
            password: form_data.password
        });
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const status = err.response.status;
            const detail = err.response.data?.detail || "Error inesperado";
            throw new AuthError(detail, status);
        }
        throw new AuthError("Error de conexión con el servidor", 0);
    }
}