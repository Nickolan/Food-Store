import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Navbar() {
    const { usuario, isAuthenticated, logout } = useAuth();
    if (!isAuthenticated) {
        return (
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link to="/" className="text-2xl font-bold text-orange-600 tracking-tight">
                        Sabor&Gestión
                </Link>
                <div className="space-x-4">
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
                    <Link to="/admin/pedidos" className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                        Pedidos
                    </Link>
                )}
                <Link
                    to={perfilUrl}
                    className="text-stone-600 hover:text-orange-600 transition-colors font-medium"
                >
                    Mi Perfil
                </Link>
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