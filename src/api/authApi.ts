import axios from "axios";
import type { LoginResponse, Usuario } from "../models/Usuario";

const api = axios.create({ baseURL: "http://localhost:8000" });

export async function login(form_data: { email: string; password: string }): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>("/usuarios/login", {
        email: form_data.email,
        password: form_data.password
    });
    
    return response.data;
}

export async function getMe({access_token}: {access_token: string}): Promise<Usuario> {
    const response = await api.get<Usuario>("/usuarios/me", {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
    return response.data;
}