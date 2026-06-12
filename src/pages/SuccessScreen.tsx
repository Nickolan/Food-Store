import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../features/Navbar';
import { confirmarPagoConMP } from '../api/pagosApi';

function SuccessScreen() {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState('');
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  useEffect(() => {
    const pid = searchParams.get('pedido');
    const collectionStatus = searchParams.get('collection_status');
    const collectionId = searchParams.get('collection_id');

    if (collectionStatus === 'approved') {
      setMensaje('El pago fue acreditado correctamente. Tu pedido ya está en preparación.');
      if (pid) setPedidoId(pid);

      if (collectionId) {
        confirmarPagoConMP(Number(collectionId))
          .catch(() => {
            // Reintentar una vez después de 3 segundos si falla
            setTimeout(() => {
              confirmarPagoConMP(Number(collectionId)).catch(() => {});
            }, 3000);
          });
      }
    } else {
      setMensaje('El pago fue procesado correctamente.');
    }
  }, [searchParams]);

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            ¡Pedido confirmado!
          </h1>
          <p className="text-gray-600 mb-2">{mensaje}</p>
          {pedidoId && (
            <p className="text-sm text-gray-500 mb-6">
              N° de pedido: <span className="font-bold text-gray-900">{pedidoId}</span>
            </p>
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

export default SuccessScreen;
