import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../features/Navbar';
import { obtenerPedidoPorId } from '../api/pedidosApi';

function PendingScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pedidoId = searchParams.get('pedido');
  const [isPolling, setIsPolling] = useState(!!pedidoId);

  useEffect(() => {
    if (!pedidoId || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const pedido = await obtenerPedidoPorId(Number(pedidoId));
        // Si el backend ya lo registró como confirmado (por el webhook de MP),
        // redirigimos automáticamente a la pantalla de éxito.
        if (pedido.estado_codigo === 'CONFIRMADO' || pedido.estado_codigo === 'EN_PREP') {
          setIsPolling(false);
          navigate(`/success?pedido=${pedido.id}`);
        } else if (pedido.estado_codigo === 'CANCELADO') {
          setIsPolling(false);
          navigate('/mis-pedidos');
        }
      } catch (err) {
        // Ignoramos errores temporales de red durante el polling
      }
    }, 3000); // Poll cada 3 segundos

    return () => clearInterval(interval);
  }, [pedidoId, isPolling, navigate]);
  return (
    <div className="bg-orange-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Procesando tu pago...
          </h1>
          <p className="text-gray-600 mb-6">
            Por favor completa el pago en la pestaña de Mercado Pago que se acaba de abrir. 
            Esta pantalla se actualizará automáticamente apenas se confirme la transacción.
          </p>

          {isPolling && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 text-stone-500 font-medium">
                <svg className="animate-spin h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Esperando confirmación...
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              to="/catalogo"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Seguir comprando
            </Link>
            <Link
              to="/"
              className="w-full text-stone-500 hover:text-stone-700 py-2 text-sm font-medium transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingScreen;
