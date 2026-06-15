import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "../models/Usuario";
import { login as loginApi, getMe, logout as logoutApi, signUpApi, AuthError } from "../api/authApi";

interface AuthContextType {
    usuario: Usuario | null;
    isAuthenticated: boolean;
    token?: string | null;
    loading: boolean;
    initializing: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    signUp: (nombre: string, apellido: string, email: string, celular: string, password: string) => Promise<boolean>;
    getUsuarioFromToken: () => Promise<Usuario>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // true mientras restauramos la sesión desde localStorage al montar
    const [initializing, setInitializing] = useState(() => !!localStorage.getItem('token'));

    // ── Restaurar sesión al refrescar ─────────────────────────────────────────
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setInitializing(false);
            return; 
        }

        getMe()
            .then((user) => {
                setUsuario(user);
                setToken(storedToken);
            })
            .catch(() => {
                // Token inválido o expirado → limpiar
                localStorage.removeItem('token');
            })
            .finally(() => {
                setInitializing(false);
            });
    }, []);

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
        } catch (err) {
            if (err instanceof AuthError) {
                if (err.status === 429) {
                    const minutos = err.retryAfter ? Math.ceil(err.retryAfter / 60) : 15;
                    setError(
                        `Has superado los 5 intentos fallidos. Estarás bloqueado por ${minutos} minutos.`
                    );
                } else if (err.status === 403) {
                    setError("Tu cuenta está desactivada. Contactá al administrador.");
                } else {
                    setError("Credenciales inválidas. Verificá tu email y contraseña.");
                }
            } else {
                setError("Error de conexión con el servidor.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (nombre: string, apellido: string, email: string, celular: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const data = await signUpApi({ nombre, apellido, email, celular, password });
            console.log(data);
            setUsuario(data);
            return true;
        } catch (err) {
            if (err instanceof AuthError) {
                if (err.status === 400) {
                    setError("Ya existe una cuenta con este correo electrónico.");
                } else if (err.status === 422) {
                    const mensajes: Record<string, string> = {
                        "String should have at least 8 characters": "La contraseña debe tener por lo menos 8 caracteres",
                    };
                    setError(mensajes[err.message] ?? err.message);
                } else {
                    setError("Error al registrarse. Por favor, intentá nuevamente.");
                }
            } else {
                setError("Error de conexión con el servidor.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    }


    const logout = async () => {
        await logoutApi();
        setUsuario(null);
        setError(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const getUsuarioFromToken = async () => {
        const response = await getMe();
        setUsuario(response);
        console.log("Usuario Obtenido: ", response);
        
        return response;
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                isAuthenticated: usuario !== null,
                initializing,
                loading,
                error,
                login,
                logout,
                token,
                signUp,
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