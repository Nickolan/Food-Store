import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCarrito } from "../context/carritoContext";

function CarritoBoton({ onClick }: { onClick?: () => void }) {
    const { totalItems, toggleCarrito } = useCarrito();
    return (
        <button
            onClick={() => { onClick?.(); toggleCarrito(); }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
            aria-label="Abrir carrito"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    );
}

// Ícono hamburger / X reutilizable
function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
        </svg>
    );
}

const linkClass = "text-stone-600 hover:text-orange-600 transition-colors font-medium text-base py-2";

function Navbar() {
    const { usuario, isAuthenticated, logout } = useAuth();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const cerrar = () => setMenuAbierto(false);

    const usuarioRoles = usuario?.roles ?? [];
    const isAdmin = usuarioRoles.some(r => r.codigo === "ADMIN");
    const shouldShowStock = usuarioRoles.some(r => r.codigo === "STOCK");
    const shouldShowPedidos = usuarioRoles.some(r => r.codigo === "PEDIDOS");
    const displayRole = usuarioRoles.find(r => r.codigo === "ADMIN")?.nombre
        ?? usuarioRoles[0]?.nombre
        ?? usuarioRoles[0]?.codigo
        ?? "";
    const initial = usuario?.nombre?.charAt(0).toUpperCase() ?? "?";
    const perfilUrl = usuario ? `/usuario/${usuario.id}` : "/";

    return (
        <>
            <nav className="sticky top-0 z-30 bg-orange-50/90 backdrop-blur-sm border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-4 md:py-5">
                    {/* Logo */}
                    <Link to="/" onClick={cerrar} className="text-xl md:text-2xl font-bold text-orange-600 tracking-tight shrink-0">
                        Sabor&amp;Gestión
                    </Link>

                    {/* Desktop links — ocultos en mobile */}
                    <div className="hidden md:flex items-center gap-6">
                        {!isAuthenticated && (
                            <>
                                <CarritoBoton />
                                <Link to="/login" className={linkClass}>Iniciar Sesión</Link>
                                <Link to="/signup" className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
                                    Registrarse
                                </Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                {isAdmin && <Link to="/admin" className={linkClass}>Dashboard</Link>}
                                {!isAdmin && (
                                    <>
                                        <Link to="/catalogo" className={linkClass}>Catálogo</Link>
                                        <Link to="/mis-pedidos" className={linkClass}>Mis Pedidos</Link>
                                    </>
                                )}
                                {shouldShowStock && <Link to="/admin/stock" className={linkClass}>Stock</Link>}
                                {shouldShowPedidos && <Link to="/admin/pedidos" className={linkClass}>Pedidos</Link>}
                                {!isAdmin && <CarritoBoton />}

                                <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                                    <Link to={perfilUrl} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-medium text-gray-900">{usuario?.nombre} {usuario?.apellido}</span>
                                            <span className="text-xs text-gray-500">{displayRole}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center text-white font-semibold shrink-0">
                                            {initial}
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => { console.log("🚪 Ejecutando logout"); logout(); }}
                                        className="px-4 py-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg font-medium text-sm"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile right — carrito + hamburger */}
                    <div className="flex md:hidden items-center gap-3">
                        {!isAdmin && <CarritoBoton onClick={cerrar} />}
                        <button
                            onClick={() => setMenuAbierto(v => !v)}
                            className="p-2 rounded-xl text-stone-700 hover:bg-orange-100 transition-colors"
                            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                            aria-expanded={menuAbierto}
                        >
                            <HamburgerIcon open={menuAbierto} />
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuAbierto ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                    aria-hidden={!menuAbierto}
                >
                    <div className="flex flex-col px-4 pb-5 gap-1 border-t border-orange-100">
                        {!isAuthenticated && (
                            <>
                                <NavLink to="/login" onClick={cerrar} className={linkClass}>Iniciar Sesión</NavLink>
                                <NavLink to="/signup" onClick={cerrar} className="mt-2 w-full text-center bg-red-400 hover:bg-red-500 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                                    Registrarse
                                </NavLink>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                {isAdmin && <NavLink to="/admin" onClick={cerrar} className={linkClass}>Dashboard</NavLink>}
                                {!isAdmin && (
                                    <>
                                        <NavLink to="/catalogo" onClick={cerrar} className={linkClass}>Catálogo</NavLink>
                                        <NavLink to="/mis-pedidos" onClick={cerrar} className={linkClass}>Mis Pedidos</NavLink>
                                    </>
                                )}
                                {shouldShowStock && <NavLink to="/admin/stock" onClick={cerrar} className={linkClass}>Stock</NavLink>}
                                {shouldShowPedidos && <NavLink to="/admin/pedidos" onClick={cerrar} className={linkClass}>Pedidos</NavLink>}

                                <div className="mt-3 pt-3 border-t border-orange-100 flex items-center justify-between">
                                    <Link to={perfilUrl} onClick={cerrar} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center text-white font-semibold">
                                            {initial}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{usuario?.nombre} {usuario?.apellido}</p>
                                            <p className="text-xs text-gray-500">{displayRole}</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => { logout(); cerrar(); }}
                                        className="px-3 py-1.5 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition-all rounded-lg font-medium text-sm"
                                    >
                                        Salir
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;