import { Link } from "react-router-dom";

export default function MenuScreen() {
  const opciones = [
    { to: "/productos", titulo: "Productos", descripcion: "Administración del catálogo y stock." },
    { to: "/ingredientes", titulo: "Ingredientes", descripcion: "Gestión de insumos y alérgenos." },
    { to: "/categorias", titulo: "Categorías", descripcion: "Organización de secciones del menú." },
  ];

  return (
    <div className="mx-auto max-w-5xl py-16 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
          Panel de <span className="text-blue-600">Administración</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Gestioná el catálogo de tu tienda de comida de forma rápida y sencilla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opciones.map((op) => (
          <Link
            key={op.to}
            to={op.to}
            className="group block border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-all hover:border-blue-400"
          >
            <div className="mb-4 inline-block p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {op.titulo}
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {op.descripcion}
            </p>
            <span className="text-sm font-bold text-blue-600 flex items-center group-hover:gap-2 transition-all">
              ACCEDER <span className="ml-1">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
