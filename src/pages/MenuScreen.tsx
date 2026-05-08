import { Link } from "react-router-dom";

export default function MenuScreen() {
  return (
    <>
      <div className="flex flex-col items-center mt-10 justify-center px-4">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-7xl mb-8 sm:mb-10 text-center">
          Bienvenido
        </h1>

        <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-3">
          <Link
            to="/ingredientes"
            className="w-full md:w-auto text-center border rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white font-bold py-3 px-6"
          >
            Ver todos los ingredientes
          </Link>

          <Link
            to="/productos"
            className="w-full md:w-auto text-center border rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white font-bold py-3 px-6"
          >
            Ver todos los productos
          </Link>

          <Link
            to="/categorias"
            className="w-full md:w-auto text-center border rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white font-bold py-3 px-6"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    </>
  );
}
