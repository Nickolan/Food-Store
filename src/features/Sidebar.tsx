import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';


export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-white border-r border-orange-100 flex flex-col w-[15%] min-w-[200px] z-50 relative">
      <div className="px-6 py-6">
        <Link to="/" className="text-orange-600 font-bold text-xl block hover:opacity-80 transition-opacity">
          Sabor&Gestión
        </Link>
      </div>
      <nav className="flex flex-col gap-2 mt-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Inicio
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            `flex items-center gap-3 transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Usuarios
        </NavLink>
        <NavLink
          to="/admin/categorias"
          className={({ isActive }) =>
            `block transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Categorías
        </NavLink>
        <NavLink
          to="/admin/ingredientes"
          className={({ isActive }) =>
            `block transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Ingredientes
        </NavLink>
        <NavLink
          to="/admin/productos"
          className={({ isActive }) =>
            `block transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Productos
        </NavLink>
      </nav>
      <button
        className="text-orange-600 font-bold px-6 py-3 hover:bg-orange-50 transition-colors w-full text-left mt-auto mb-8"
        onClick={() => {
          logout();
          navigate('/')
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}