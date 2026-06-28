import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { CategoriasContext } from '../context/categoriasContext';
import FormCategoria from '../features/formCategoria';
import { getCategorias } from '../api/categoriasApi';
import type { Categoria } from '../models/Categoria';

interface BreadcrumbItem {
    id: number | null;
    name: string;
}

const ITEMS_PER_PAGE = 10;

export default function CategoriaScreen() {
    const context = useContext(CategoriasContext);

    if (!context) {
        return <div>Cargando...</div>;
    }

    const { categorias: todasLasCategorias, categoriaSeleccionada, setCategoriaSeleccionada } = context;

    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroActivo, setFiltroActivo] = useState('activos');

    const [currentParentId, setCurrentParentId] = useState<number | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { id: null, name: 'Categorias Raiz' }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

    // ─── Estado del fetch propio ──────────────────────────────────────────────
    const [items, setItems] = useState<Categoria[]>([]);
    const [total, setTotal] = useState(0);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [refetchKey, setRefetchKey] = useState(0);

    // Debounce del nombre
    const [nombreDebounced, setNombreDebounced] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleNombreChange = (value: string) => {
        setFiltroNombre(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setNombreDebounced(value);
            setCurrentPage(1);
        }, 400);
    };

    // ─── Fetch desde servidor ─────────────────────────────────────────────────
    const fetchCategorias = useCallback(async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
            const activoParam = filtroActivo === 'activos' ? true : filtroActivo === 'inactivos' ? false : undefined;
            // Cuando hay texto buscamos en todos los niveles; si no, navegamos por jerarquía
            const usarJerarquia = !nombreDebounced;
            const { items: fetched, total: fetchedTotal } = await getCategorias({
                limit: ITEMS_PER_PAGE,
                offset: (currentPage - 1) * ITEMS_PER_PAGE,
                nombre: nombreDebounced || undefined,
                activo: activoParam,
                ...(usarJerarquia
                    ? currentParentId === null
                        ? { solo_raiz: true }
                        : { parent_id: currentParentId }
                    : {}),
            });
            setItems(fetched);
            setTotal(fetchedTotal);
        } catch {
            setFetchError('No se pudo cargar las categorías.');
        } finally {
            setFetchLoading(false);
        }
    }, [nombreDebounced, filtroActivo, currentPage, currentParentId, refetchKey]);

    useEffect(() => { fetchCategorias(); }, [fetchCategorias]);

    // Resetear página al cambiar filtros
    useEffect(() => { setCurrentPage(1); }, [filtroActivo, currentParentId]);

    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

    // ─── Navegación de jerarquía ──────────────────────────────────────────────
    const handleNavigate = (parentId: number | null, name: string) => {
        setCurrentParentId(parentId);
        setCurrentPage(1);
        if (parentId === null) {
            setBreadcrumbs([{ id: null, name: 'Categorias Raiz' }]);
        } else {
            setBreadcrumbs(prev => [...prev, { id: parentId, name }]);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        setBreadcrumbs(newBreadcrumbs);
        setCurrentParentId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
        setCurrentPage(1);
    };

    // hasHijos: usa el contexto que tiene todas las categorías activas cargadas
    const hasHijos = (categoriaId: number): boolean => {
        return todasLasCategorias.some(c => c.parent_id === categoriaId);
    };

    const triggerRefetch = () => setRefetchKey(k => k + 1);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 mb-6">
                <div>
                    <h1 className="text-stone-900 text-xl sm:text-2xl font-bold">Categorias</h1>
                    <p className="text-gray-500 text-sm mt-1">Administra las categorias de tus productos</p>
                </div>
                <button
                    onClick={() => setMostrarModalCrear(true)}
                    className="w-full sm:w-auto bg-orange-600 font-bold text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                    + Nueva Categoria
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={filtroNombre}
                            onChange={(e) => handleNombreChange(e.target.value)}
                            className="h-10 rounded-lg border border-orange-200 px-3 text-sm text-stone-900 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none w-full sm:w-52"
                        />
                        <select
                            value={filtroActivo}
                            onChange={(e) => setFiltroActivo(e.target.value)}
                            className="h-10 rounded-lg border border-orange-200 px-3 text-sm text-stone-900 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none bg-white w-full sm:w-auto"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activos">Activos</option>
                            <option value="inactivos">Inactivos</option>
                        </select>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                        {total} categoria{total !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Breadcrumbs — solo visibles cuando no hay búsqueda de texto */}
                {!nombreDebounced && (
                    <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-stone-900">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.id ?? 'root'}>
                                {index > 0 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className={`transition-colors ${
                                        index === breadcrumbs.length - 1
                                            ? 'text-gray-400 cursor-default'
                                            : 'text-stone-900 hover:underline cursor-pointer'
                                    }`}
                                >
                                    {crumb.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {fetchError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        {fetchError}
                    </div>
                )}

                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-orange-50 text-stone-900 text-xs uppercase font-bold">
                            <tr>
                                <th className="py-3 px-4 text-center">ID</th>
                                <th className="py-3 px-4 text-center">NOMBRE</th>
                                <th className="py-3 px-4 text-center">DESCRIPCION</th>
                                <th className="py-3 px-4 text-center">ESTADO</th>
                                <th className="py-3 px-4 text-center">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {fetchLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center">
                                        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                                            <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                                            Cargando...
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center text-sm text-gray-400 border-b border-orange-100">
                                        No se encontraron categorias.
                                    </td>
                                </tr>
                            ) : (
                                items.map((categoria) => {
                                    const tieneHijos = hasHijos(categoria.id!);
                                    return (
                                        <tr key={categoria.id} className="transition hover:bg-orange-50">
                                            <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                                                {categoria.id}
                                            </td>
                                            <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm">
                                                <div className="flex items-center justify-center gap-2">
                                                    {tieneHijos && !nombreDebounced ? (
                                                        <button
                                                            onClick={() => handleNavigate(categoria.id!, categoria.nombre)}
                                                            className="flex items-center justify-center gap-2 cursor-pointer hover:text-orange-600 transition-colors group"
                                                        >
                                                            <span className="text-sm text-stone-900">{categoria.nombre}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm text-stone-900">{categoria.nombre}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                                                {categoria.descripcion || "-"}
                                            </td>
                                            <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    categoria.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-800'
                                                }`}>
                                                    {categoria.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 border-b border-orange-100 text-stone-900 text-sm text-center">
                                                <div className="flex justify-center items-center gap-4">
                                                    <button
                                                        onClick={() => setCategoriaSeleccionada(categoria)}
                                                        className="text-gray-400 hover:text-stone-900 transition-colors outline-none"
                                                        title="Editar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            await context.actualizar({ ...categoria, activo: !categoria.activo });
                                                            triggerRefetch();
                                                        }}
                                                        className={`transition-colors outline-none ${
                                                            categoria.activo ? 'text-gray-400 hover:text-orange-600' : 'text-gray-400 hover:text-emerald-600'
                                                        }`}
                                                        title={categoria.activo ? "Dar de baja" : "Dar de alta"}
                                                    >
                                                        {categoria.activo ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 border-t border-orange-100 pt-6">
                        <button
                            disabled={currentPage === 1 || fetchLoading}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="w-full sm:w-auto px-4 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-orange-50 disabled:opacity-50 transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-500">
                            Pagina {currentPage} de {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages || fetchLoading}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="w-full sm:w-auto px-4 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-orange-50 disabled:opacity-50 transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {mostrarModalCrear && (
                <FormCategoria cerrar={() => { setMostrarModalCrear(false); triggerRefetch(); }} />
            )}

            {categoriaSeleccionada && (
                <FormCategoria
                    cerrar={() => { setCategoriaSeleccionada(null); triggerRefetch(); }}
                    categoriaAEditar={categoriaSeleccionada}
                />
            )}
        </div>
    );
}
