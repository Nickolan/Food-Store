import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../features/Navbar';
import { useCarrito } from '../context/carritoContext';
import { useAuth } from '../context/authContext';
import { direccionesApi, type Direccion } from '../api/direccionesApi';
import { crearPedido } from '../api/pedidosApi';
import { crearPago } from '../api/pagosApi';

function CheckoutScreen() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrecio, vaciarCarrito } = useCarrito();
  const { usuario, isAuthenticated } = useAuth();

  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formaPago, setFormaPago] = useState<'EFECTIVO' | 'MERCADOPAGO'>('MERCADOPAGO');
  const [pedidoExitoso, setPedidoExitoso] = useState(false);

  const costoEnvio = formaPago === 'EFECTIVO' ? 0 : 50;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (totalItems === 0 && !pedidoExitoso) {
      navigate('/catalogo', { replace: true });
      return;
    }
  }, [isAuthenticated, totalItems, navigate, pedidoExitoso]);

  useEffect(() => {
    direccionesApi.listar()
      .then((dirs) => {
        setDirecciones(dirs);
        const principal = dirs.find((d) => d.es_principal);
        if (principal) setDireccionSeleccionada(principal.id);
        else if (dirs.length > 0) setDireccionSeleccionada(dirs[0].id);
      })
      .catch(() => setError('No se pudieron cargar tus direcciones.'))
      .finally(() => setCargandoDirecciones(false));
  }, []);

  const handleConfirmar = async () => {
    if (formaPago !== 'EFECTIVO' && !direccionSeleccionada) {
      setError('Seleccioná una dirección de entrega.');
      return;
    }

    setConfirmando(true);
    setError(null);

    try {
      const pedido = await crearPedido({
        forma_pago_codigo: formaPago,
        direccion_id: formaPago === 'EFECTIVO' ? undefined : direccionSeleccionada,
        descuento: 0,
        costo_envio: formaPago === 'EFECTIVO' ? 0 : 50,
        items: items.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          personalizacion:
            item.ingredientes_removidos.length > 0
              ? item.ingredientes_removidos
              : undefined,
        })),
      });

      if (formaPago === 'MERCADOPAGO') {
        const pago = await crearPago({ pedido_id: pedido.id });
        const checkoutUrl = pago.checkout_url;

        if (checkoutUrl) {
          setPedidoExitoso(true);
          vaciarCarrito();
          window.open(checkoutUrl, '_blank');
          navigate(`/pending?pedido=${pedido.id}`);
        } else {
          setError('No se pudo obtener la URL de pago. Intentá de nuevo.');
        }
      } else {
        setPedidoExitoso(true);
        vaciarCarrito();
        navigate(`/success?pedido=${pedido.id}`);
      }
    } catch (err: any) {
      const mensaje =
        err.response?.data?.detail ||
        err.message ||
        'Ocurrió un error al procesar tu pedido.';
      setError(typeof mensaje === 'string' ? mensaje : 'Error inesperado.');
    } finally {
      setConfirmando(false);
    }
  };

  if (!isAuthenticated || totalItems === 0) return null;

  return (
    <div className="bg-orange-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-orange-500 pl-3">
          Checkout
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">
                Tu Pedido
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 bg-orange-50 rounded-xl p-4 border border-orange-100"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-orange-100 shrink-0 flex items-center justify-center">
                      {item.imagen_url ? (
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">🍽️</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.nombre}
                      </p>
                      <p className="text-orange-600 font-bold text-sm">
                        ${item.precio_base.toFixed(2)}
                      </p>
                      {item.ingredientes_removidos.length > 0 && (
                        <p className="text-xs text-red-500 mt-0.5">
                          Sin: {item.ingredientes_removidos.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-gray-500 text-xs">x{item.cantidad}</p>
                      <p className="text-gray-900 font-bold text-sm">
                        ${(item.precio_base * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className={`bg-white rounded-lg shadow-md p-6 ${formaPago === 'EFECTIVO' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 border-l-4 border-orange-500 pl-3">
                  Dirección de entrega
                </h2>
                {formaPago === 'EFECTIVO' && (
                  <span className="text-xs bg-orange-100 text-orange-800 font-medium px-2 py-1 rounded-md">
                    Retiro en local
                  </span>
                )}
              </div>

              {cargandoDirecciones ? (
                <p className="text-gray-500 text-sm">Cargando direcciones...</p>
              ) : direcciones.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No tenés direcciones registradas.{' '}
                  <a
                    href={`/usuario/${usuario?.id}`}
                    className="text-orange-600 underline"
                  >
                    Agregá una desde tu perfil
                  </a>
                </p>
              ) : (
                <div className="space-y-2">
                  {direcciones.map((dir) => (
                    <label
                      key={dir.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        direccionSeleccionada === dir.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="direccion"
                        value={dir.id}
                        checked={direccionSeleccionada === dir.id}
                        onChange={() => setDireccionSeleccionada(dir.id)}
                        className="accent-orange-600 w-4 h-4 mt-0.5"
                      />
                      <div>
                        {dir.alias && (
                          <p className="font-semibold text-gray-900 text-sm">
                            {dir.alias}
                            {dir.es_principal && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                PRINCIPAL
                              </span>
                            )}
                          </p>
                        )}
                        <p className="text-gray-700 text-sm">{dir.linea1}</p>
                        {dir.linea2 && (
                          <p className="text-gray-500 text-xs">{dir.linea2}</p>
                        )}
                        <p className="text-gray-600 text-xs">
                          {dir.ciudad}
                          {dir.provincia && `, ${dir.provincia}`}
                          {' — CP: '}
                          {dir.codigo_postal}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">
                Forma de pago
              </h2>
              <div className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    formaPago === 'MERCADOPAGO'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="formaPago"
                    value="MERCADOPAGO"
                    checked={formaPago === 'MERCADOPAGO'}
                    onChange={() => setFormaPago('MERCADOPAGO')}
                    className="accent-orange-600 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Mercado Pago</p>
                    <p className="text-gray-500 text-xs">Tarjetas, dinero en cuenta. (+ $50 envío)</p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    formaPago === 'EFECTIVO'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="formaPago"
                    value="EFECTIVO"
                    checked={formaPago === 'EFECTIVO'}
                    onChange={() => setFormaPago('EFECTIVO')}
                    className="accent-orange-600 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Efectivo</p>
                    <p className="text-gray-500 text-xs">Pagás al recibir. (Envío gratis)</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">
                Resumen
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    ${totalPrecio.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Envío</span>
                  <span className="text-gray-900 font-medium">
                    {costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-gray-900 font-bold text-base">Total</span>
                  <span className="text-orange-600 font-extrabold text-lg">
                    ${(totalPrecio + costoEnvio).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmar}
                disabled={confirmando}
                className="mt-6 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {confirmando ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutScreen;
