import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCarrito } from "../context/carritoContext";

function CarritoBoton() {
    const { totalItems, toggleCarrito } = useCarrito();
    return (
        <button
            onClick={toggleCarrito}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
            aria-label="Abrir carrito"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span>Carrito</span>
            {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    );
}

function Navbar() {
    const { usuario, isAuthenticated, logout } = useAuth();
    if (!isAuthenticated) {
        return (
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link to="/" className="text-2xl font-bold text-orange-600 tracking-tight">
                        Sabor&Gestión
                </Link>
                <div className="flex items-center gap-4">
                    <CarritoBoton />
                    <Link
                        to="/login"
                        className="text-stone-600 hover:text-orange-600 transition-colors font-medium"
                    >
                        Iniciar Sesión
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm"
                    >
                        Registrarse
                    </Link>
                </div>
            </nav>
        );
    }
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
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
            <Link to="/" className="text-2xl font-bold text-orange-600 tracking-tight">
                        Sabor&Gestión
            </Link>
            <div className="flex items-center gap-6">
                {isAdmin && (
                    <Link to="/admin" className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                        Dashboard
                    </Link>
                )}
                {!isAdmin && (
                    <>
                        <Link to="/catalogo" className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                            Catálogo
                        </Link>
                        <Link to="/" className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                            Mis Pedidos
                        </Link>
                    </>
                )}
                {shouldShowStock && (
                    <Link to="/" className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                        Stock
                    </Link>
                )}
                {shouldShowPedidos && (
                    <Link to="/" className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                        Pedidos
                    </Link>
                )}
                <Link
                    to={perfilUrl}
                    className="text-stone-600 hover:text-orange-600 transition-colors font-medium"
                >
                    Mi Perfil
                </Link>
                {!isAdmin && <CarritoBoton />}
            </div>
            <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4">
                <Link to={perfilUrl} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">
                            {usuario?.nombre} {usuario?.apellido}
                        </span>
                        <span className="text-xs text-gray-500">{displayRole}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center text-white font-semibold">
                        {initial}
                    </div>
                </Link>
                <button
                    onClick={() => {
                        console.log("🚪 Ejecutando logout");
                        logout();
                    }}
                    className="px-4 py-2 border-2 border-orange-500 text-orange-600 
                            hover:bg-orange-50 hover:text-orange-700 
                            transition-all duration-200 rounded-lg font-medium text-sm"
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}
export default Navbar;