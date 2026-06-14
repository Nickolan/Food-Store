import axios from "axios";
import type { LoginResponse, Usuario } from "../models/Usuario";
const api = axios.create({ baseURL: "http://localhost:8000/api/v6/auth", withCredentials: true });

export async function login(form_data: { email: string; password: string }): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>("/token", {
        email: form_data.email,
        password: form_data.password
    });
    
    return response.data;
}

export async function getMe(): Promise<Usuario> {
    const response = await api.get<Usuario>("/me");
    return response.data;
}

export async function logout(): Promise<void> {
    await api.post("/logout");
}

export async function signUpApi(form_data: { nombre: string; apellido: string; email: string; celular: string; password: string }): Promise<Usuario> {
    const response = await api.post<Usuario>("/", {
        nombre: form_data.nombre,
        apellido: form_data.apellido,
        email: form_data.email,
        celular: form_data.celular,
        password: form_data.password
    });
    return response.data;
}