import axios from 'axios';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Categoria } from '../models/Categoria';
import type { Producto } from '../models/Producto';
import { getCategorias } from '../api/categoriasApi';
import { getProductos, productosPorCategoria } from '../api/productosApi';
import Navbar from '../features/Navbar';
import ProductCard from '../features/catalogo/ProductCard';
import FiltrosCatalogo from '../features/catalogo/FiltrosCatalogo';
import DetalleProductoModal from '../features/components/DetalleProductoModal';
import CarritoDrawer from '../features/CarritoDrawer';
import { useCarrito } from '../context/carritoContext';

const PAGE_SIZE = 9;
const BASE_URL = 'http://localhost:8000';

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-48 bg-orange-100" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-orange-100 rounded-lg w-3/4" />
        <div className="h-3 bg-orange-50 rounded-lg w-full" />
        <div className="h-3 bg-orange-50 rounded-lg w-5/6" />
        <div className="flex items-center justify-between pt-2 mt-1">
          <div className="h-6 bg-orange-100 rounded-lg w-16" />
          <div className="h-9 bg-orange-100 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
}

// ─── Estado vacío ─────────────────────────────────────────────────────────────
function EmptyState({ filtrosActivos }: { filtrosActivos: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-7xl">🔍</span>
      <h3 className="text-xl font-bold text-stone-800">
        {filtrosActivos ? 'Sin resultados para esa búsqueda' : 'No hay productos disponibles'}
      </h3>
      <p className="text-stone-500 text-sm max-w-xs">
        {filtrosActivos
          ? 'Probá con otro término o cambiá la categoría seleccionada.'
          : 'Estamos trabajando para traerte más opciones pronto.'}
      </p>
    </div>
  );
}

// ─── Paginado ─────────────────────────────────────────────────────────────────
function Paginado({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (p: number) => void;
}) {
  if (totalPaginas <= 1) return null;

  const pages = Array.from({ length: totalPaginas }, (_, i) => i);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Paginación del catálogo">
      <button
        id="btn-pagina-anterior"
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 0}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-orange-100 text-stone-600 text-sm font-medium hover:bg-orange-50 hover:text-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Anterior
      </button>

      <div className="flex gap-1">
        {pages.map((p) => (
          <button
            key={p}
            id={`btn-pagina-${p + 1}`}
            onClick={() => onCambiarPagina(p)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
              p === paginaActual
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-200'
                : 'bg-white border border-orange-100 text-stone-600 hover:bg-orange-50 hover:text-orange-700'
            }`}
          >
            {p + 1}
          </button>
        ))}
      </div>

      <button
        id="btn-pagina-siguiente"
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas - 1}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-orange-100 text-stone-600 text-sm font-medium hover:bg-orange-50 hover:text-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Siguiente
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
}

// ─── Screen principal ─────────────────────────────────────────────────────────
function CatalogoScreen() {
  const { agregarProducto } = useCarrito();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalProductos, setTotalProductos] = useState(0);

  // Cuando hay categoría seleccionada, guardamos los IDs válidos obtenidos
  // desde GET /categorias/{id} (CategoriaReadFull.productos[])
  const [idsCategoria, setIdsCategoria] = useState<Set<number> | null>(null);
  const [cargandoCategoria, setCargandoCategoria] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // ── Cargar categorías activas ─────────────────────────────────────────────
  useEffect(() => {
    getCategorias({ limit: 100 })
      .then((items) => setCategorias(items.filter((c) => c.activo)))
      .catch((err) => console.error('Error al cargar categorías:', err));
  }, []);

  // ── Cargar productos (server-side: nombre + paginado) ────────────────────
  // Se re-ejecuta cuando cambia la búsqueda o la página
  useEffect(() => {
    setCargando(true);
    getProductos({
      nombre: busqueda.trim() || undefined,
      activo: true,
      limit: categoriaSeleccionada !== null
        ? 100   // traemos más para poder filtrar por categoría client-side
        : PAGE_SIZE,
      offset: categoriaSeleccionada !== null
        ? 0
        : paginaActual * PAGE_SIZE,
    })
      .then(({ items, total }) => {
        setProductos(items);
        setTotalProductos(total);
      })
      .catch((err) => console.error('Error al cargar productos:', err))
      .finally(() => setCargando(false));
  }, [busqueda, paginaActual, categoriaSeleccionada]);

  // ── Resolver IDs de productos para la categoría seleccionada ─────────────
  // GET /categorias/{id} devuelve CategoriaReadFull con productos: ProductoBasicRead[]
  useEffect(() => {
    if (categoriaSeleccionada === null) {
      setIdsCategoria(null);
      return;
    }

    setCargandoCategoria(true);
    productosPorCategoria(categoriaSeleccionada)
      .then(({ items, total }) => {
        console.log('Productos obtenidos para la categoría:', items);
        const ids: Set<number> = new Set(items.map((p: Producto) => p.id));
        setIdsCategoria(ids);
      })
      .catch((err) => {
        console.error('Error al obtener productos de la categoría:', err);
        setIdsCategoria(new Set());
      })
      .finally(() => setCargandoCategoria(false));
  }, [categoriaSeleccionada]);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setPaginaActual(0);
  }, [busqueda, categoriaSeleccionada]);

  // ── Filtrado final (client-side, sobre lo que trajo el server) ───────────
  const productosFiltrados = useMemo(() => {
    if (idsCategoria !== null) {
      return productos.filter((p) => idsCategoria.has(p.id));
    }
    return productos;
  }, [productos, idsCategoria]);

  // Paginado: sólo aplica cuando NO hay categoría (ya viene paginado del server)
  // Cuando hay categoría, filtramos el bloque local y paginamos client-side
  const productosPagina = useMemo(() => {
    if (categoriaSeleccionada !== null) {
      return productosFiltrados.slice(paginaActual * PAGE_SIZE, (paginaActual + 1) * PAGE_SIZE);
    }
    // Sin categoría → los productos ya vienen paginados del server
    return productosFiltrados;
  }, [productosFiltrados, categoriaSeleccionada, paginaActual]);

  const totalEfectivo = categoriaSeleccionada !== null ? productosFiltrados.length : totalProductos;
  const totalPaginas = Math.max(1, Math.ceil(totalEfectivo / PAGE_SIZE));

  const filtrosActivos = categoriaSeleccionada !== null || busqueda.trim() !== '';
  const estasCargando = cargando || cargandoCategoria;

  const handleAgregarAlCarrito = (producto: Producto, cantidad?: number, ingredientesRemovidos?: number[]) => {
    agregarProducto(producto, cantidad ?? 1, ingredientesRemovidos ?? []);
  };

  const handleAgregarDesdeModal = (productoId: number, cantidad: number, ingredientesRemovidos: number[]) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      agregarProducto(producto, cantidad, ingredientesRemovidos);
    }
  };

  const handleCategoriaChange = useCallback((id: number | null) => {
    setCategoriaSeleccionada(id);
    setPaginaActual(0);
  }, []);

  const handleBusquedaChange = useCallback((valor: string) => {
    setBusqueda(valor);
    setPaginaActual(0);
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-stone-800">
      <Navbar />
      <CarritoDrawer />

      {/* Hero compacto */}
      <header className="bg-white border-b border-orange-100 py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
            Nuestro <span className="text-orange-600">Catálogo</span>
          </h1>
          <p className="text-stone-500 mt-2 text-base max-w-xl">
            Explorá nuestra selección de platos y encontrá tu favorito.
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── Sidebar de filtros ── */}
          <FiltrosCatalogo
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={handleCategoriaChange}
            busqueda={busqueda}
            onBusquedaChange={handleBusquedaChange}
            totalResultados={totalEfectivo}
          />

          {/* ── Grid de productos ── */}
          <section className="flex-1 min-w-0">
            {estasCargando ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : productosPagina.length === 0 ? (
              <EmptyState filtrosActivos={filtrosActivos} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productosPagina.map((producto) => (
                    <ProductCard
                      key={producto.id}
                      producto={producto}
                      onAgregarAlCarrito={handleAgregarAlCarrito}
                      onSeleccionarProducto={setProductoSeleccionado}
                    />
                  ))}
                </div>

                <Paginado
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  onCambiarPagina={setPaginaActual}
                />
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modal de detalle de producto */}
      <DetalleProductoModal
        producto={productoSeleccionado}
        isOpen={productoSeleccionado !== null}
        onClose={() => setProductoSeleccionado(null)}
        onAgregar={handleAgregarDesdeModal}
      />
    </div>
  );
}

export default CatalogoScreen;