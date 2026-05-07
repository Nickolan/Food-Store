import axios from "axios";
import type { LoginResponse } from "../models/Usuario";

const api = axios.create({ baseURL: "http://localhost:8000" });

export async function login(data: { email: string; password: string }): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/usuarios/login", data);
    return response.data;
}