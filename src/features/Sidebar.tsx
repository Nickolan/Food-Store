import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { TbTruckDelivery } from "react-icons/tb";


export default function Sidebar() {
  const { logout, usuario } = useAuth();
  const esAdmin = usuario?.roles?.some((r) => r.codigo === 'ADMIN');

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
            <NavLink to="/admin/categorias" className={linkClass}>
              Categorías
            </NavLink>
            <NavLink to="/admin/ingredientes" className={linkClass}>
              Ingredientes
            </NavLink>
            <NavLink to="/admin/productos" className={linkClass}>
              Productos
            </NavLink>
          </>
        )}
        <NavLink to="/admin/pedidos" className={linkClass}>
          <TbTruckDelivery className="text-lg" />
          Pedidos
        </NavLink>
      </nav>
      <button
        className="text-orange-600 font-bold px-6 py-3 hover:bg-orange-50 transition-colors w-full text-left mt-auto mb-8"
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}