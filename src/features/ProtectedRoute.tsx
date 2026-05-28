import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({children, rolesHabilitados}: {children: React.ReactNode; rolesHabilitados: string[]}) => {
    const { getUsuarioFromToken } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verificarAcceso = async () => {
            try {
                const usuario = await getUsuarioFromToken();
                
                if (!usuario) {
                    setIsAuthorized(false);
                    return;
                }

                console.log("Roles del usuario: ", usuario.roles);
                console.log("Roles Permitidos", rolesHabilitados);
                
                const tieneRolHabilitado = usuario.roles.some((rol) => 
                    rolesHabilitados.includes(rol.codigo)
                );
                
                setIsAuthorized(tieneRolHabilitado);
            } catch (error) {
                console.error("Error validando sesión:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        verificarAcceso();
    }, []); 

    if (isLoading) {
        return <div>Cargando validación de seguridad...</div>; 
    }

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;