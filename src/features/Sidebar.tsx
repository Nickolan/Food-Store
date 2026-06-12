import { NavLink, Link, useNavigate } from 'react-router-dom';
import { HiOutlineClipboard, HiOutlineTag, HiOutlineCube, HiOutlineShoppingBag } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";
import { useAuth } from '../context/authContext';


export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const esAdmin = usuario?.roles.some(r => r.codigo === "ADMIN") ?? false;
  const esPedidos = usuario?.roles.some(r => r.codigo === "PEDIDOS") ?? false;
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
        {esAdmin && (
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
        )}
        <NavLink
          to="/admin/categorias"
          className={({ isActive }) =>
            `flex items-center gap-3 transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          <HiOutlineTag className="h-5 w-5" />
          Categorías
        </NavLink>
        <NavLink
          to="/admin/ingredientes"
          className={({ isActive }) =>
            `flex items-center gap-3 transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          <HiOutlineCube className="h-5 w-5" />
          Ingredientes
        </NavLink>
        <NavLink
          to="/admin/productos"
          className={({ isActive }) =>
            `flex items-center gap-3 transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          <HiOutlineShoppingBag className="h-5 w-5" />
          Productos
        </NavLink>
        <NavLink
          to="/admin/stock"
          className={({ isActive }) =>
            `flex items-center gap-3 transition-colors ${
              isActive
                ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          <HiOutlineClipboard className="h-5 w-5" />
          Stock
        </NavLink>
        {(esAdmin || esPedidos) && (
          <NavLink
            to="/admin/pedidos"
            className={({ isActive }) =>
              `flex items-center gap-3 transition-colors ${
                isActive
                  ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
              }`
            }
          >
            <TbTruckDelivery className="h-5 w-5" />
            Pedidos
          </NavLink>
        )}
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
