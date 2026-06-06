import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { direccionesApi, type Direccion, type CrearDireccionDTO } from '../../api/direccionesApi';
import { toast } from 'react-hot-toast'; 

interface DireccionesManagerProps {
  readonly?: boolean; // Si es readonly, solo muestra, no permite editar
}

export default function DireccionesManager({ readonly = false }: DireccionesManagerProps) {
  const queryClient = useQueryClient();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState<Direccion | null>(null);
  const [nuevaDireccion, setNuevaDireccion] = useState<Partial<CrearDireccionDTO>>({
    alias: '',
    linea1: '',
    linea2: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    es_principal: false,
  });

  // Query para cargar direcciones
  const { data: direcciones = [], isLoading, error } = useQuery({
    queryKey: ['direcciones'],
    queryFn: direccionesApi.listar,
  });

  // Mutations
  const crearMutation = useMutation({
    mutationFn: (data: CrearDireccionDTO) => direccionesApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      toast.success('Dirección agregada correctamente');
      setModalAbierto(false);
      resetFormulario();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al crear dirección');
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      direccionesApi.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      toast.success('Dirección actualizada correctamente');
      setModalAbierto(false);
      setDireccionEditando(null);
      resetFormulario();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al actualizar dirección');
    },
  });

  const marcarPrincipalMutation = useMutation({
    mutationFn: (id: number) => direccionesApi.marcarPrincipal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      toast.success('Dirección principal actualizada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al marcar como principal');
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => direccionesApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      toast.success('Dirección eliminada correctamente');
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.error('Debes tener al menos una dirección registrada');
      } else {
        toast.error(error.response?.data?.detail || 'Error al eliminar dirección');
      }
    },
  });

  const resetFormulario = () => {
    setNuevaDireccion({
      alias: '',
      linea1: '',
      linea2: '',
      ciudad: '',
      provincia: '',
      codigo_postal: '',
      es_principal: false,
    });
  };

  const handleAbrirModal = (direccion?: Direccion) => {
    if (readonly) return;
    if (direccion) {
      setDireccionEditando(direccion);
      setNuevaDireccion({
        alias: direccion.alias || '',
        linea1: direccion.linea1,
        linea2: direccion.linea2 || '',
        ciudad: direccion.ciudad,
        provincia: direccion.provincia || '',
        codigo_postal: direccion.codigo_postal,
        es_principal: direccion.es_principal,
      });
    } else {
      setDireccionEditando(null);
      resetFormulario();
    }
    setModalAbierto(true);
  };

  const handleGuardarDireccion = () => {
    if (!nuevaDireccion.linea1 || !nuevaDireccion.ciudad || !nuevaDireccion.codigo_postal) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    if (direccionEditando) {
      actualizarMutation.mutate({
        id: direccionEditando.id,
        data: nuevaDireccion,
      });
    } else {
      crearMutation.mutate(nuevaDireccion as CrearDireccionDTO);
    }
  };

    const handleEliminar = (id: number) => {
        if (direcciones.length <= 1) {
        alert('No puedes eliminar la única dirección registrada. Debes tener al menos una dirección para recibir tus pedidos.');
        return;
        }
        if (window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
        eliminarMutation.mutate(id);
        }
    };

  if (isLoading) return <div className="text-center py-4">Cargando direcciones...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error al cargar direcciones</div>;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Direcciones</h3>
        {!readonly && (
          <button
            onClick={() => handleAbrirModal()}
            className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm"
          >
            + Nueva dirección
          </button>
        )}
      </div>

      <div className="space-y-3">
        {direcciones.map((direccion) => (
          <div
            key={direccion.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {direccion.alias && (
                    <span className="font-semibold text-gray-900">{direccion.alias}</span>
                  )}
                  {direccion.es_principal && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      PRINCIPAL
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{direccion.linea1}</p>
                {direccion.linea2 && <p className="text-gray-500 text-sm">{direccion.linea2}</p>}
                <p className="text-gray-700">
                  {direccion.ciudad}
                  {direccion.provincia && `, ${direccion.provincia}`}
                </p>
                <p className="text-gray-500 text-sm">CP: {direccion.codigo_postal}</p>
              </div>

              {!readonly && (
                <div className="flex gap-2">
                  {!direccion.es_principal && (
                    <button
                      onClick={() => marcarPrincipalMutation.mutate(direccion.id)}
                      className="text-yellow-600 hover:text-yellow-700 text-sm px-2 py-1"
                      title="Marcar como principal"
                    >
                      ★ Marcar principal
                    </button>
                  )}
                  <button
                    onClick={() => handleAbrirModal(direccion)}
                    className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1"
                  >
                     Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(direccion.id)}
                    className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
                  >
                     Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {direcciones.length === 0 && (
          <p className="text-gray-500 text-center py-4">No tienes direcciones registradas</p>
        )}
      </div>

      {/* Modal para crear/editar dirección */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {direccionEditando ? 'Editar dirección' : 'Nueva dirección'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alias (opcional)</label>
                <input
                  type="text"
                  value={nuevaDireccion.alias || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, alias: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ej: Casa, Oficina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Línea 1 * (calle y número)
                </label>
                <input
                  type="text"
                  value={nuevaDireccion.linea1 || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, linea1: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Línea 2 (opcional)</label>
                <input
                  type="text"
                  value={nuevaDireccion.linea2 || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, linea2: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Depto, piso, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                <input
                  type="text"
                  value={nuevaDireccion.ciudad || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia (opcional)</label>
                <input
                  type="text"
                  value={nuevaDireccion.provincia || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, provincia: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                <input
                  type="text"
                  value={nuevaDireccion.codigo_postal || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codigo_postal: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="es_principal"
                  checked={nuevaDireccion.es_principal || false}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, es_principal: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="es_principal" className="text-sm text-gray-700">
                  Establecer como dirección principal
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setModalAbierto(false);
                  setDireccionEditando(null);
                  resetFormulario();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarDireccion}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                disabled={crearMutation.isPending || actualizarMutation.isPending}
              >
                {crearMutation.isPending || actualizarMutation.isPending
                  ? 'Guardando...'
                  : 'Guardar dirección'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}