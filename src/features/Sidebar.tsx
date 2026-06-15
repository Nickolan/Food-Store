import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { HiOutlineClipboard, HiOutlineTag, HiOutlineCube, HiOutlineShoppingBag, HiOutlineChartBar, HiOutlineHome, HiOutlineUsers, HiOutlineLogout, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";
import { useAuth } from '../context/authContext';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 transition-all duration-200 rounded-xl mx-2 ${
          isActive
            ? 'bg-orange-600 text-white font-bold shadow-sm'
            : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50'
        } ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 text-sm font-medium'}`
      }
    >
      <span className="shrink-0 text-[1.1rem]">{icon}</span>
      {!collapsed && (
        <span className="truncate text-sm">{label}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const esAdmin = usuario?.roles.some(r => r.codigo === "ADMIN") ?? false;
  const esPedidos = usuario?.roles.some(r => r.codigo === "PEDIDOS") ?? false;
  const esStock = usuario?.roles.some(r => r.codigo === "STOCK") ?? false;

  return (
    <aside
      className={`h-screen bg-white border-r border-orange-100 flex flex-col z-50 relative transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo / Brand */}
      <div className={`flex items-center py-5 border-b border-orange-50 overflow-hidden ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        {collapsed ? (
          <Link to="/" title="Sabor&Gestión" className="text-orange-600 text-xl font-extrabold hover:opacity-80 transition-opacity">
            S
          </Link>
        ) : (
          <Link to="/" className="text-orange-600 font-bold text-lg block hover:opacity-80 transition-opacity truncate">
            Sabor&amp;Gestión
          </Link>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 mt-3 flex-1 overflow-y-auto overflow-x-hidden">
        <NavItem to="/admin" icon={<HiOutlineHome className="h-5 w-5" />} label="Inicio" collapsed={collapsed} />

        {esAdmin && (
          <NavItem to="/admin/usuarios" icon={<HiOutlineUsers className="h-5 w-5" />} label="Usuarios" collapsed={collapsed} />
        )}
        {(esAdmin || esStock) && (
          <NavItem to="/admin/categorias" icon={<HiOutlineTag className="h-5 w-5" />} label="Categorías" collapsed={collapsed} />
        )}
        {(esAdmin || esStock) && (
          <NavItem to="/admin/ingredientes" icon={<HiOutlineCube className="h-5 w-5" />} label="Ingredientes" collapsed={collapsed} />
        )}
        {(esAdmin || esStock) && (
          <NavItem to="/admin/productos" icon={<HiOutlineShoppingBag className="h-5 w-5" />} label="Productos" collapsed={collapsed} />
        )}
        {(esAdmin || esStock) && (
          <NavItem to="/admin/stock" icon={<HiOutlineClipboard className="h-5 w-5" />} label="Stock" collapsed={collapsed} />
        )}
        {(esAdmin || esPedidos) && (
          <NavItem to="/admin/pedidos" icon={<TbTruckDelivery className="h-5 w-5" />} label="Pedidos" collapsed={collapsed} />
        )}
        {esAdmin && (
          <NavItem to="/admin/estadisticas" icon={<HiOutlineChartBar className="h-5 w-5" />} label="Estadísticas" collapsed={collapsed} />
        )}
      </nav>

      {/* Footer: logout + toggle */}
      <div className="border-t border-orange-100 py-3 flex flex-col gap-1">
        {/* Logout */}
        <button
          title={collapsed ? "Cerrar Sesión" : undefined}
          className={`flex items-center gap-3 text-orange-600 hover:bg-orange-50 transition-colors rounded-xl mx-2 font-medium ${
            collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 text-sm'
          }`}
          onClick={async () => {
            await logout();
            navigate('/');
          }}
        >
          <HiOutlineLogout className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">Cerrar Sesión</span>}
        </button>

        {/* Toggle collapse */}
        <button
          onClick={() => setCollapsed(v => !v)}
          title={collapsed ? "Expandir menú" : "Contraer menú"}
          className={`flex items-center gap-3 text-stone-400 hover:text-stone-700 hover:bg-orange-50 transition-colors rounded-xl mx-2 ${
            collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 text-sm'
          }`}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? (
            <HiOutlineChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <HiOutlineChevronLeft className="h-5 w-5 shrink-0" />
              <span className="truncate text-sm">Contraer</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}