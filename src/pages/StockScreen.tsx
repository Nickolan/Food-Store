import { useEffect, useState } from 'react';
import { getIngredientes, updateIngrediente } from '../api/ingredientesApi';
import type { Ingrediente } from '../models/Ingrediente';

type Filtro = 'todos' | 'bajo';

export default function StockScreen() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);
  const [nuevoStock, setNuevoStock] = useState<string>('');
  const [guardando, setGuardando] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const cargarIngredientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIngredientes({ limit: 100 });
      setIngredientes(data.items);
    } catch {
      setError('No se pudieron cargar los ingredientes. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIngredientes();
  }, []);

  const ingredientesFiltrados =
    filtro === 'bajo'
      ? ingredientes.filter((i) => i.stock_cantidad < 10)
      : ingredientes;

  const abrirModal = (ingrediente: Ingrediente) => {
    setIngredienteSeleccionado(ingrediente);
    setNuevoStock(String(ingrediente.stock_cantidad));
    setModalError(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setIngredienteSeleccionado(null);
    setNuevoStock('');
    setModalError(null);
  };

  const guardarStock = async () => {
    if (!ingredienteSeleccionado) return;
    const valor = parseInt(nuevoStock, 10);
    if (isNaN(valor) || valor < 0) {
      setModalError('Ingresá un número válido mayor o igual a 0.');
      return;
    }
    setGuardando(true);
    setModalError(null);
    try {
      await updateIngrediente(ingredienteSeleccionado.id!, { stock_cantidad: valor });
      setIngredientes((prev) =>
        prev.map((i) =>
          i.id === ingredienteSeleccionado.id ? { ...i, stock_cantidad: valor } : i
        )
      );
      cerrarModal();
    } catch {
      setModalError('Error al guardar. Intentá nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-stone-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Gestión de Materia Prima</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              filtro === 'todos'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('bajo')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              filtro === 'bajo'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            Stock bajo
          </button>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-400 text-sm">
          Cargando ingredientes...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-red-500 text-sm">
          {error}
        </div>
      ) : ingredientesFiltrados.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-stone-400 text-sm">
          {filtro === 'bajo'
            ? 'No hay ingredientes con stock bajo.'
            : 'No hay ingredientes registrados.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-stone-500 uppercase text-xs tracking-wide">
                <th className="px-5 py-3 text-left font-semibold">ID</th>
                <th className="px-5 py-3 text-left font-semibold">Nombre</th>
                <th className="px-5 py-3 text-left font-semibold">Precio</th>
                <th className="px-5 py-3 text-left font-semibold">Unidad</th>
                <th className="px-5 py-3 text-left font-semibold">Stock</th>
                <th className="px-5 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientesFiltrados.map((ing, idx) => (
                <tr
                  key={ing.id}
                  className={`border-t border-stone-100 transition-colors hover:bg-orange-50 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'
                  }`}
                >
                  <td className="px-5 py-3 text-stone-400 font-mono">{ing.id}</td>
                  <td className="px-5 py-3 text-stone-800 font-medium">{ing.nombre}</td>
                  <td className="px-5 py-3 text-stone-800">
                    {ing.precio != null ? `$${ing.precio}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-stone-800 text-xs">
                    {ing.unidad_medida?.simbolo ?? '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ing.stock_cantidad < 10
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ing.stock_cantidad < 10 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      />
                      {ing.stock_cantidad}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => abrirModal(ing)}
                      className="px-3 py-1.5 rounded-md bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200 hover:bg-orange-100 transition-colors"
                    >
                      Actualizar stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && ingredienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-1">Actualizar stock</h2>
            <p className="text-sm text-stone-500 mb-4">
              <span className="font-medium text-stone-700">{ingredienteSeleccionado.nombre}</span>
              {' — '}stock actual:{' '}
              <span className="font-semibold text-stone-700">
                {ingredienteSeleccionado.stock_cantidad}
              </span>
            </p>

            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
              Nuevo stock
            </label>
            <input
              type="number"
              min={0}
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="0"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && guardarStock()}
            />

            {modalError && (
              <p className="mt-2 text-xs text-red-600">{modalError}</p>
            )}

            <div className="flex gap-2 mt-5 justify-end">
              <button
                onClick={cerrarModal}
                disabled={guardando}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={guardarStock}
                disabled={guardando}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}