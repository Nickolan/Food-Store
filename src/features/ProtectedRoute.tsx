import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const ProtectedRoute = ({children, rolesHabilitados}: any) => {

    const {getUsuarioFromToken} = useAuth();
    
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          getUsuarioFromToken(token).then((usuario) => {
            if (!usuario) {
              localStorage.removeItem('token');
              return <Navigate to="/" />;
            }

            // Revisar si el usuario tiene el rol necesario para acceder a la ruta protegida
            const tieneRolHabilitado: boolean = usuario.roles.some((rol) => rolesHabilitados.includes(rol.codigo));
            if (!tieneRolHabilitado) {
              return <Navigate to="/" />;
            }
          })
          
        } else {
          console.log("No token found in localStorage.");
        }
      }, [])
    

    return children;
}

export default ProtectedRoute
