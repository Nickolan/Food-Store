import { createContext, use, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../models/Usuario";
import { login as loginApi, getMe } from "../api/authApi";

interface AuthContextType {
    usuario: Usuario | null;
    isAuthenticated: boolean;
    token?: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    getUsuarioFromToken: (token: string) => Promise<Usuario>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginApi({ email, password });
            console.log(data);
            
            setUsuario(data.usuario);
            localStorage.setItem('token', data.access_token);
            setToken(data.access_token);
            return true;
        } catch {
            setError("Credenciales inválidas. Verificá tu email y contraseña.");
            return false;
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        setUsuario(null);
        setError(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const getUsuarioFromToken = async (token: string) => {
        const response = await getMe({ access_token: token });
        setUsuario(response);
        console.log("Usuario Obtenido: ", response);
        
        return response;
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                isAuthenticated: usuario !== null,
                loading,
                error,
                login,
                logout,
                token,
                getUsuarioFromToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}