import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../features/Navbar';

function FailureScreen() {
  const [searchParams] = useSearchParams();
  const statusDetail = searchParams.get('status_detail');

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Pago no procesado
          </h1>
          <p className="text-gray-600 mb-6">
            {statusDetail
              ? `Detalle: ${statusDetail}`
              : 'El pago no pudo completarse. Podés intentar de nuevo.'}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/checkout"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Intentar de nuevo
            </Link>
            <Link
              to="/catalogo"
              className="w-full text-stone-500 hover:text-stone-700 py-2 text-sm font-medium transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FailureScreen;
