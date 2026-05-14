import { NavLink, Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="h-screen bg-[#1D3557] flex flex-col w-[15%] min-w-[200px] shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-50 relative">
      <div className="px-6 py-6">
        <Link to="/" className="text-[#E63946] font-bold text-xl block hover:opacity-80 transition-opacity">
          FOOD-STORE
        </Link>
      </div>
      <nav className="flex flex-col gap-2 mt-2">
        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            `block transition-colors ${
              isActive
                ? 'border-l-4 border-[#E63946] bg-white/5 text-[#E63946] px-6 py-3 font-bold text-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Categorías
        </NavLink>
        <NavLink
          to="/ingredientes"
          className={({ isActive }) =>
            `block transition-colors ${
              isActive
                ? 'border-l-4 border-[#E63946] bg-white/5 text-[#E63946] px-6 py-3 font-bold text-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Ingredientes
        </NavLink>
        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `block transition-colors ${
              isActive
                ? 'border-l-4 border-[#E63946] bg-white/5 text-[#E63946] px-6 py-3 font-bold text-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 px-6 py-3 text-sm font-medium'
            }`
          }
        >
          Productos
        </NavLink>
      </nav>
      <button
        className="text-[#E63946] font-bold px-6 py-3 hover:bg-[#E63946]/10 transition-colors w-full text-left mt-auto mb-8"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
