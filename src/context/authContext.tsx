import { createContext, useState, type ReactNode } from "react";
import type { Usuario } from "../models/Usuario";
import { login as loginApi } from "../api/authApi";

interface AuthContextType {
    usuario: Usuario | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginApi({ email, password });
            setUsuario(data.usuario);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
