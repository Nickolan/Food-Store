import { NavLink, Link, useNavigate } from 'react-router-dom';
import { HiOutlineClipboard, HiOutlineTag, HiOutlineCube, HiOutlineShoppingBag } from "react-icons/hi";
import { useAuth } from '../context/authContext';
import { TbTruckDelivery } from "react-icons/tb";

export default function Sidebar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  const roles = usuario?.roles?.map(r => r.codigo) ?? [];
  const esAdmin = roles.includes('ADMIN');
  const esStock = roles.includes('STOCK');
  const esPedidos = roles.includes('PEDIDOS');

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block transition-colors flex items-center gap-2 ${
      isActive
        ? 'border-l-4 border-orange-600 bg-orange-50 text-orange-600 px-6 py-3 font-bold text-sm'
        : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50 px-6 py-3 text-sm font-medium'
    }`;

  return (
    <div className="h-screen bg-white border-r border-orange-100 flex flex-col w-[15%] min-w-[200px] z-50 relative">
      <div className="px-6 py-6">
        <Link to="/" className="text-orange-600 font-bold text-xl block hover:opacity-80 transition-opacity">
          Sabor&Gestión
        </Link>
      </div>
      <nav className="flex flex-col gap-2 mt-2">
        {esAdmin && (
          <>
            <NavLink to="/admin" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/admin/usuarios" className={linkClass}>
              Usuarios
            </NavLink>
          </>
        )}
        {(esAdmin || esStock) && (
          <>
            <NavLink to="/admin/categorias" className={linkClass}>
              <HiOutlineTag className="h-5 w-5" />
              Categorías
            </NavLink>
            <NavLink to="/admin/ingredientes" className={linkClass}>
              <HiOutlineCube className="h-5 w-5" />
              Ingredientes
            </NavLink>
            <NavLink to="/admin/productos" className={linkClass}>
              <HiOutlineShoppingBag className="h-5 w-5" />
              Productos
            </NavLink>
            <NavLink to="/admin/stock" className={linkClass}>
              <HiOutlineClipboard className="h-5 w-5" />
              Stock
            </NavLink>
          </>
        )}
        {(esAdmin || esPedidos) && (
          <NavLink to="/admin/pedidos" className={linkClass}>
            <TbTruckDelivery className="text-lg" />
            Pedidos
          </NavLink>
        )}
      </nav>
      <button
        className="text-orange-600 font-bold px-6 py-3 hover:bg-orange-50 transition-colors w-full text-left mt-auto mb-8"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
