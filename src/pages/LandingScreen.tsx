import Navbar from '../features/Navbar';
import { Link } from 'react-router-dom';

function LandingScreen() {
  return (
    <div className="min-h-screen bg-orange-50 font-sans text-stone-800">
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 leading-tight">
            Tus platos favoritos, <br />
            <span className="text-orange-600">directo a tu puerta.</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-lg">
            Explora nuestro catálogo, personaliza tus pedidos con los mejores ingredientes y guarda tus direcciones para recibir tu comida caliente y a tiempo.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to={"/catalogo"} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-md">
              Ver Catalogo
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full aspect-square md:aspect-auto md:h-96 bg-orange-200 rounded-3xl flex items-center justify-center shadow-inner overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 to-transparent"></div>
          <span className="text-orange-800/50 font-medium text-xl">
            [Imagen ilustrativa de un plato cálido]
          </span>
        </div>
      </main>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-stone-500 mt-4 max-w-2xl mx-auto">
              Diseñado tanto para que disfrutes de la mejor experiencia como usuario, como para que los administradores gestionen cada detalle del menú.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center text-2xl mb-6">
                🍔
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Catálogos Dinámicos</h3>
              <p className="text-stone-600 leading-relaxed">
                Navega por menús organizados. Los administradores pueden gestionar productos e ingredientes en tiempo real.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                📍
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Gestión de Direcciones</h3>
              <p className="text-stone-600 leading-relaxed">
                Registra tu cuenta y guarda múltiples direcciones para agilizar la logística de tus entregas.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                🛍️
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Pedidos Fáciles</h3>
              <p className="text-stone-600 leading-relaxed">
                Agrega al carrito, personaliza tus platillos y realiza el seguimiento de tus pedidos sin complicaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingScreen;