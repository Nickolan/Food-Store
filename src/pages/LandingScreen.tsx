import CarritoDrawer from '../features/CarritoDrawer';
import Navbar from '../features/Navbar';
import { Link } from 'react-router-dom';

function LandingScreen() {
  return (
    <div className="min-h-screen bg-orange-50 font-sans text-stone-800">
      
      <Navbar />
      <CarritoDrawer />

      <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-5 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-stone-900 leading-tight">
            Tus platos favoritos, <br />
            <span className="text-orange-600">directo a tu puerta.</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-lg mx-auto md:mx-0">
            Explora nuestro catálogo, personaliza tus pedidos con los mejores ingredientes y guarda tus direcciones para recibir tu comida caliente y a tiempo.
          </p>
          <div className="flex gap-4 pt-2 justify-center md:justify-start">
            <Link to={"/catalogo"} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold text-base sm:text-lg transition-colors shadow-md text-center">
              Ver Catalogo
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full h-56 sm:h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl relative">
          <img
            src="/hero_hot_meal.png"
            alt="Plato caliente gourmet con salmón y vegetales asados"
            className="w-full h-full object-cover"
          />
        </div>
      </main>

      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-stone-500 mt-3 md:mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Diseñado tanto para que disfrutes de la mejor experiencia como usuario, como para que los administradores gestionen cada detalle del menú.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center text-2xl mb-4 md:mb-6">
                🍔
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-stone-800">Catálogos Dinámicos</h3>
              <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                Navega por menús organizados. Los administradores pueden gestionar productos e ingredientes en tiempo real.
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4 md:mb-6">
                📍
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-stone-800">Gestión de Direcciones</h3>
              <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                Registra tu cuenta y guarda múltiples direcciones para agilizar la logística de tus entregas.
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-xl flex items-center justify-center text-2xl mb-4 md:mb-6">
                🛍️
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-stone-800">Pedidos Fáciles</h3>
              <p className="text-stone-600 leading-relaxed text-sm md:text-base">
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